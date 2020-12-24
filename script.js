const coffee = {
  kopiKenanganMantan  : ['Kopi Kenangan Mantan', 'Kopi, Susu, Espresso, Pait', 18000],
  dualShotIcedShaken     : ['Dual Shot Iced Shaken', 'Kopi, Susu, Espresso, Pait', 22000],
  americano       : ['Americano / Long Black', 'Kopi, Susu, Espresso, Pait', 15000],
  kopiKelapa    : ['Kopi Kelapa (Kemana Lagi Pacar?)', 'Kopi, Susu, Espresso, Pait', 19000]
}

let order     = {};

function loadMenu() {
  // load coffee
  Object.entries(coffee).map(([key, value]) => {
    document.getElementsByClassName('coffee')[0]
    .innerHTML += `<div class='menu'>
                    <div class='row'>
                    <div class='col-sm'>
                      One of three columns
                    </div>
                    <div class='col-sm'>
                      One of three columns
                    </div>
                    <div class='col-sm'>
                    <div class='counter'>
                      <button class='btn minus hide' type='button'>-</button>
                      <p class='quantity'>0</p>
                      <button class='btn plus' type='button'>+</button>
                    </div>
                    </div>
                  </div>
                  </div>


                  <div class='menu'>
                      <div>
                          <h1>${value[0]}</h1>
                          <p>${value[1]}</p>
                          <span>${value[2]}</span>
                      </div>
                      <div class='counter'>
                        <button class='btn minus hide' type='button'>-</button>
                        <p class='quantity'>0</p>
                        <button class='btn plus' type='button'>+</button>
                      </div>
                  </div>`;
  });
}

function setQuantity() {
  let quantity   = document.getElementsByClassName('quantity');
  let counter    = document.getElementsByClassName('counter');
  let orderName  = document.querySelectorAll('.menu > div > h1');
  let orderPrice = document.querySelectorAll('.menu > div > span');
  for(let i = 0; i < counter.length; i++) {
    counter[i].addEventListener('click', function(e){
      let target = e.target;
      let currQuantity = parseInt(quantity[i].innerHTML);
      // add or substract quantity of order
      if(target.className == 'btn plus'){
        currQuantity += 1;
      } else if(target.className == 'btn minus' || target.className == 'btn minus hide') {
        currQuantity -= 1;
      }
      // set order
      order[orderName[i].innerHTML] = [parseInt(orderPrice[i].innerHTML), currQuantity];
      // minus button will be disabled if quantity is 0 or less
      document.getElementsByClassName('quantity')[i].innerHTML = currQuantity;
      if(currQuantity > 0) {
        document.getElementsByClassName('minus')[i].classList.remove('hide');
      } else {
        document.getElementsByClassName('minus')[i].classList.add('hide');
      }
    });
  }
}

function setOrder() {
  document.getElementById('order')
  .addEventListener('click', function(){
    let totalPrice = 0;
    let orderDetail = Object.entries(order).map(([key, value]) => {
      totalPrice += value[0] * value[1];
      return `${key}: (${value[1]} x ${value[0]})\n`;
    });
    if (totalPrice > 0) {
      displayOrder(orderDetail, totalPrice);
      sendMessages(orderDetail, totalPrice);
    }
  });
}

// display order list & total price
function displayOrder(orderDetail, totalPrice){
  let orderWrapper = document.getElementById('order-status');
  let orderTitle = "<h1>Here are your order</h1>";
  let orderList = '<ul>';
  for(let i = 0; i < orderDetail.length; i++) {
    orderList += `<li>${orderDetail[i]}</li>`;
  }
  orderList += '</ul>';
  orderList += `<span>Total Price: Rp. ${totalPrice}</span>`;
  orderWrapper.innerHTML = orderTitle + orderList;
  orderWrapper.classList.remove('hide');
}

function sendMessages(orderDetail, totalPrice){
  if (!liff.isInClient()) {
      alert("sent message only works in LINE in-app browser.")
  } else {
    let msg = getOrderList(orderDetail, totalPrice);
    liff.sendMessages([{
        'type': 'text',
        'text': msg
    }]).then(function() {
        alert('Pesan terkirim');
    }).catch(function(error) {
        alert('Aduh kok error ya...');
    });
  }
}

function getOrderList(orderDetail, totalPrice){
  let msg = "Hai, we are preparing your orders.\n\n";
  for(let i=0; i < orderDetail.length; i++){
    msg += orderDetail[i];
  }
  msg += `\nTotal Price: Rp. ${totalPrice}`;
  return msg;
}

loadMenu();
setQuantity();
setOrder();
