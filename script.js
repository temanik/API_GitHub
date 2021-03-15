const input = document.querySelector('.form__input');
const select = document.querySelector('.repositories__select-list');
const options = document.querySelectorAll('.repositories__select-item');
let repositoriesList = document.querySelector('.repositories__list');;
let repositories;

function getRepositoriesItem(name, owner, stars) {
  let repositoriesItemFragment = document.createElement('li')
  repositoriesItemFragment.classList.add('repositories__item', 'repository')
  repositoriesItemFragment.innerHTML =
    `<div class="repository__content">
        <div class="repository__name">Name: ${name}</div>
        <div class="repository__owner">Owner: ${owner}</div>
        <div class="repository__stars">Stars: ${stars}</div>
     </div>
     <div class="close"></div>`;

  repositoriesList.appendChild(repositoriesItemFragment)
  return repositoriesItemFragment;
}

input.addEventListener('input', (e) => {
  if (input.value === '') {
    select.setAttribute('style', 'display: none');
  } else {
    debounceUpdateWindow(input.value)
  }

})

select.addEventListener('click', (e) => {
  let elementName = e.target.textContent;
  let element = repositories.find((item) => {
    if (elementName === item.name) {
      return true
    }
  })

  if (element) {
    let RepositoriesItem = getRepositoriesItem(
      element.name,
      element.owner.login,
      element.stargazers_count
    )

    select.setAttribute('style', 'display: none');
    input.value = ''

    let closeBtn = RepositoriesItem.querySelector('.close')
    closeBtn.addEventListener('click', (e) => {
      closeBtn.parentNode.remove()
    })
  }
})

async function updateWindow(params) {
  repositories = await sendRequest(params)
  console.log(repositories);

  for (let i = 0; i < options.length; i++) {
    options[i].textContent = ''
    if (!repositories) return
    if (repositories[i]) options[i].textContent = repositories[i].name
  }

  select.setAttribute('style', 'display: block');
}


function sendRequest(request) {
  let https = `https://api.github.com/search/repositories?q=${request}&per_page=5`

  if (!input.value) return

  return fetch(https)
    .then(response => {
      return response.json();
    })
    .then(repo => {
      return repo.items;
    })
    .catch((e) => console.log(e))
}


function debounce(fn) {
  let timeoutId;
  let blocked = false;

  return function () {
    if (blocked) {
      clearTimeout(timeoutId);
    };

    blocked = true
    timeoutId = setTimeout(() => {
      blocked = false;
      fn.apply(this, arguments)
    }, 2000);
  }
}

const debounceUpdateWindow = debounce(updateWindow);

