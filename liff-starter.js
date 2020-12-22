window.onload = function() {
    const useNodeJS = false;   // if you are not using a node server, set this value to false
    const defaultLiffId = "1655324788-QA9maw1o";   // change the default LIFF value if you are not using a node server

    // DO NOT CHANGE THIS
    let myLiffId = "";

    // if node is used, fetch the environment variable and pass it to the LIFF method
    // otherwise, pass defaultLiffId
    if (useNodeJS) {
        fetch('/send-id')
            .then(function(reqResponse) {
                return reqResponse.json();
            })
            .then(function(jsonResponse) {
                myLiffId = jsonResponse.id;
                initializeLiffOrDie(myLiffId);
            })
            .catch(function(error) {
                document.getElementById("liffAppContent").classList.add('hidden');
                document.getElementById("nodeLiffIdErrorMessage").classList.remove('hidden');
            });
    } else {
        myLiffId = defaultLiffId;
        initializeLiffOrDie(myLiffId);
    }
};

/**
* Check if myLiffId is null. If null do not initiate liff.
* @param {string} myLiffId The LIFF ID of the selected element
*/
function initializeLiffOrDie(myLiffId) {
  initializeLiff(myLiffId);
}

/**
* Initialize LIFF
* @param {string} myLiffId The LIFF ID of the selected element
*/
function initializeLiff(myLiffId) {
    liff
        .init({
            liffId: myLiffId
        })
        .then(() => {
            // start to use LIFF's api
            initializeApp();
        })
        .catch((err) => {
            console.log(err);
        });
}

/**
 * Initialize the app by calling functions handling individual app components
 */
function initializeApp() {
    // not loged in user will stuck in login page
    if( !liff.isLoggedIn() ){
      showLogin();
    }
    setWrapper( liff.isLoggedIn() );
    displayStatus();
    displayClient();
    displayUser();
    toggleAccount();
    displayControl();
}

function setWrapper(isLogin){
  if(isLogin){
    document.getElementById('wrapper')
    .classList.remove('blank');
  } else {
    document.getElementById('wrapper')
    .classList.add('blank');
  }
}

// show login page (if not loged in)
function showLogin(){
  document.querySelector('.login-wrapper > h1').innerHTML = 'AshariFauzan-Cafetaria';
  document.querySelector('.login-wrapper > p').innerHTML = 'Hai, you need to login first to use this app.';
  document.getElementsByClassName('login-wrapper')[0]
  .classList.remove('blank');
}

// status liff
function displayStatus() {
  document.getElementById('isClient').innerHTML += `<b>${liff.isInClient()}</b>`;
  document.getElementById('isLogin').innerHTML += `<b>${liff.isLoggedIn()}</b>`;
}

// user uses in-app browser or not
function displayClient() {
  let statusClient;
  if( liff.isInClient() ){
    statusClient = "You are using LINE in-app browser.";
  } else {
    // !isClient && isLoggedIn
    if( liff.isLoggedIn() ){
      document.getElementById('account').classList.add('visible');
      document.getElementById('line-login').classList.remove('visible');
    }
    statusClient = "⚠️ You are using external browser, move to LINE in-app browser to use full features."
  }
  document.getElementById('status-client').innerHTML = statusClient;
}

// display name and picture user
function displayUser(){
  if( liff.isLoggedIn() ){
    liff.getProfile()
      .then(profile => {
        document.getElementsByClassName('greeting')[0].innerHTML = `Hallo ${profile.displayName}, selamat datang di PEP Caffee.`;
        document.querySelector('#account > img').src = profile.pictureUrl;
      })
      .catch((err) => {
        console.log('error', err);
      });
  }
}

// handle user login
function handleLogin() {
  if( !liff.isLoggedIn() ){
    liff.login();
  }
};

// handle user logout
function handleLogout(){
  document.getElementById('line-logout')
  .addEventListener('click', function(){
    if( liff.isLoggedIn() ){
      liff.logout();
      window.location.reload();
    }
  });
}

function toggleAccount(){
  document.querySelector('#account > img')
  .addEventListener('click', function(){
    document.querySelector('#account > ul').classList.toggle('blank');
  });
}

function displayControl() {
  if( liff.isInClient() ){
    document.getElementById('control-client').innerHTML = `
    <h1>Control</h1>
    <button onclick="handleExternalBrowser()">Open in External Browser</button>`;
  }
}

function handleExternalBrowser(){
  document.getElementById('open-external')
  .addEventListener('click', function(){
    liff.openWindow({
        url: 'https://pepcaffe.herokuapp.com/',
        external: true
    });
  });
}
