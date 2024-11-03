document.addEventListener('DOMContentLoaded', () => {
  const stocksData = JSON.parse(stockContent);
  const userData = JSON.parse(userContent);
  const saveButton = document.querySelector('#btnSave');
  const deleteButton = document.querySelector('#btnDelete');

  generateUserList(userData, stocksData);

  deleteButton.addEventListener('click', (event) => {
    event.preventDefault();
    
    const userId = document.querySelector('#userID').value;
    const userIndex = userData.findIndex(user => user.id == userId);

    if (userIndex !== -1) {
      userData.splice(userIndex, 1);
      generateUserList(userData, stocksData);
      document.querySelector('.userEntry').reset(); // Reset form after deletion
    } else {
      alert('User not found.');
    }
  });

  saveButton.addEventListener('click', (event) => {
    event.preventDefault();
    
    const id = document.querySelector('#userID').value;
    const firstname = document.querySelector('#firstname').value;
    const lastname = document.querySelector('#lastname').value;
    const address = document.querySelector('#address').value;
    const city = document.querySelector('#city').value;
    const email = document.querySelector('#email').value;

    if (!firstname || !lastname || !address || !city || !email) {
      alert('Please fill in all fields before saving.');
      return;
    }

    const existingUserIndex = userData.findIndex(user => user.id == id);

    if (existingUserIndex !== -1) {
      userData[existingUserIndex].user = { firstname, lastname, address, city, email };
    } else {
      const newUser = {
        id: id || Date.now(), 
        user: { firstname, lastname, address, city, email },
        portfolio: [] 
      };
      userData.push(newUser);
    }

    generateUserList(userData, stocksData);
    document.querySelector('.userEntry').reset(); 
  });

  function generateUserList(users, stocks) {
    const userList = document.querySelector('.user-list');
    userList.innerHTML = '';
    
    users.forEach(({user, id}) => {
      const listItem = document.createElement('li');
      listItem.innerText = `${user.lastname}, ${user.firstname}`;
      listItem.setAttribute('id', id);
      userList.appendChild(listItem);
    });

    userList.addEventListener('click', (event) => handleUserListClick(event, users, stocks));
  }

  function handleUserListClick(event, users, stocks) {
    const userId = event.target.id;
    const user = users.find(user => user.id == userId);
    
    if (user) {
      populateForm(user);
      renderPortfolio(user, stocks);
    }
  }

  function renderPortfolio(user, stocks) {
    const { portfolio } = user;
    const portfolioDetails = document.querySelector('.portfolio-list');
    portfolioDetails.innerHTML = `
      <h3>Symbol</h3>
      <h3># Shares</h3>
      <h3>Actions</h3>
    `;

    portfolio.forEach(({ symbol, owned }) => {
      const symbolEl = document.createElement('p');
      const sharesEl = document.createElement('p');
      const actionEl = document.createElement('button');
      
      symbolEl.innerText = symbol;
      sharesEl.innerText = owned;
      actionEl.innerText = 'View';
      actionEl.setAttribute('id', symbol);
      
      portfolioDetails.appendChild(symbolEl);
      portfolioDetails.appendChild(sharesEl);
      portfolioDetails.appendChild(actionEl);
    });

    portfolioDetails.addEventListener('click',(event) => {
      if (event.target.tagName === 'BUTTON') {
        viewStock(event.target.id, stocks);
      }
    });
  }
  
  function populateForm(data) {
    const { user, id } = data;
    document.querySelector('#userID').value = id;
    document.querySelector('#firstname').value = user.firstname;
    document.querySelector('#lastname').value = user.lastname;
    document.querySelector('#address').value = user.address;
    document.querySelector('#city').value = user.city;
    document.querySelector('#email').value = user.email;
  }
  
  function viewStock(symbol, stocks) {
    const stockArea = document.querySelector('.stock-form');
    if (stockArea) {
      const stock = stocks.find(s => s.symbol == symbol);
      
      if (stock) {
        document.querySelector('#stockName').textContent = stock.name;
        document.querySelector('#stockSector').textContent = stock.sector;
        document.querySelector('#stockIndustry').textContent = stock.subIndustry;
        document.querySelector('#stockAddress').textContent = stock.address;
        document.querySelector('#logo').src = `logos/${symbol}.svg`;
      }
    }
  } 
});