document.addEventListener('DOMContentLoaded', () => {

    const charList = document.getElementById('char-list')
    const main = document.getElementById('main')
    const searchForm = document.getElementById('search-form')
    const dltBtn = document.createElement('button')
    const favList = document.getElementById('fav-list')
    let objSpan = 'empty'
    let searchResults = [];
    let favArray;

    //Renders favorites list with data from local server
    renderFavContainer()
    .then( (favCharArray) => {
        getFavArray(favCharArray)
        favCharArray.forEach(favCharObj => {
            renderFav(favCharObj)
        })
    });

    //Stores local data to global variable
    function getFavArray(favCharArray) {
        favArray = favCharArray;
    }

    //Fetch from local server
    function renderFavContainer() {
        return fetch('http://localhost:3000/favorites')
             .then(resp => resp.json())
    }

    //Fetch from external API
    fetch('https://thronesapi.com/api/v2/Characters')
        .then(resp => resp.json())
        .then(charArray => {
            renderNav(charArray)
            formHandler(charArray)
        })
    
    //Handles search form and renders results
    function formHandler(charArray) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault()
            charList.innerHTML = '';
            dltBtn.addEventListener('click', (e) => {
                charList.innerHTML = '';
                renderNav(charArray)
                e.target.remove()
            })
            dltBtn.textContent = 'Delete';
            const userSearch = e.target.search_box.value.toLowerCase()
            if (userSearch !== '') searchForm.append(dltBtn);
            searchResults = [];
            searchResults = charArray.filter(char => {
                let lowerChar = char.fullName.toLowerCase()
                return lowerChar.includes(userSearch)
            })
            renderNav(searchResults)
            searchForm.reset()
        })
    }

    //Renders full character list from API fetch
    function renderNav(charArray) {
        charList.innerHTML = '';
        charArray.forEach(charObj => {
            const li = document.createElement('li')
            const span = document.createElement('span')
            span.textContent = charObj.fullName 
            span.addEventListener('click', (e) => {
                objSpan = e.target
                let favCharObj = favArray.find((favCharObj) => objSpan.textContent === favCharObj.fullName)
                favCharObj ? renderMainFromFavs(favCharObj, objSpan) : renderMain(charObj, span);
            })
            li.append(span)
            charList.append(li)   
        })
    }    

    //Renders individual favorites element
    function renderFav(favCharObj) {
        const li = document.createElement('li')
        const img = document.createElement('img')
        li.id = favCharObj.id
        img.src = favCharObj.imageUrl
        img.addEventListener('click', () => renderMainFromFavs(favCharObj))
        li.append(img)
        favList.append(li)
    }

    //Renders main when character is not in favorites
    function renderMain(charObj) {
        main.innerHTML = ''
        const fullName = document.createElement('h1')
        const houseName = document.createElement('h3')
        const image = document.createElement('img')
        const title = document.createElement('h3')
        const br = document.createElement('br')
        const favBtn = document.createElement('button')
        fullName.textContent = 'Name: ' + charObj.fullName
        houseName.textContent = 'House/Family: ' + charObj.family
        title.textContent = 'Title: ' + charObj.title
        image.src = charObj.imageUrl
        favBtn.textContent = 'Favorite';
        favBtn.addEventListener('click', () => {
            postFav(charObj)
            .then((favCharObj) => {
            renderFav(favCharObj)
            renderMainFromFavs(favCharObj)})
        })
        main.append(fullName, houseName, title, image, br, favBtn)
    }

    //Renders main when character is in favorites
    function renderMainFromFavs(charObj) {
        main.innerHTML = ''
        const fullName = document.createElement('h1')
        const houseName = document.createElement('h3')
        const image = document.createElement('img')
        const title = document.createElement('h3')
        const br = document.createElement('br')
        const favBtn = document.createElement('button')
        fullName.textContent = 'Name: ' + charObj.fullName
        houseName.textContent = 'House/Family: ' + charObj.family
        title.textContent = 'Title: ' + charObj.title
        image.src = charObj.imageUrl
        favBtn.textContent = 'Remove From Favorites'
        favBtn.addEventListener('click', () => {
            deleteFav(charObj)
            renderMain(charObj)
        })
        main.append(fullName, houseName, title, image, br, favBtn)
    }

    //Post request to local server
    function postFav(charObj) {
       return fetch('http://localhost:3000/favorites', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fullName: charObj.fullName,
                family: charObj.family,
                title: charObj.title,
                imageUrl: charObj.imageUrl,
                fav: 'yes',
                uniqueId: charObj.id
            })
        })
            .then(resp => resp.json())
    }

    //Delete request to local server
    function deleteFav(charObj) {
        fetch(`http://localhost:3000/favorites/${charObj.id}`, {
            method: 'DELETE'
        })
        .then(() => {
            document.getElementById(`${charObj.id}`).remove()
        })}
        
})