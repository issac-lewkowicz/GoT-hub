document.addEventListener('DOMContentLoaded', () => {
    fetch('https://thronesapi.com/api/v2/Characters')
        .then(resp => resp.json())
        .then(charArray => {
            // console.log(charArray)
            // renderNav(charArray)
            formHandler(charArray)
            renderFavContainer(charArray)
        })

    const charList = document.getElementById('char-list')
    const main = document.getElementById('main')
    const searchForm = document.getElementById('search-form')
    const dltBtn = document.createElement('button')
    const favList = document.getElementById('fav-list')
    const allSpans = document.getElementsByTagName('span')
    const theRightSpan = ''

    let serachResults = [];

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
            serachResults = [];
            serachResults = charArray.filter(char => {
                let lowerChar = char.fullName.toLowerCase()
                return lowerChar.includes(userSearch)
             })
            renderNav(serachResults)
            searchForm.reset()
        })
    }

    function renderNav(charArray, favCharArray) {
        
        charArray.forEach(char => {
            const li = document.createElement('li')
            const span = document.createElement('span')
            span.textContent = char.fullName
            span.addEventListener('click', () => {
                ! span.classList.contains('favored') ? renderMain(char, span) : renderMainFromFavs(char, span)
            })
            li.append(span)
            charList.append(li)
            
        })
        favCharArray.forEach(favChar => {
            const span = spanFinder(favChar)
            span.className = 'favored'
        })
    }    

    function renderFavContainer(charArray) {
        fetch('http://localhost:3000/favorites')
            .then(resp => resp.json())
            .then(favCharArray => {
                favCharArray.forEach(charObj => renderFav(charObj))
                renderNav(charArray, favCharArray)
            })
    }

    function renderFav(charObj) {
        const li = document.createElement('li')
        const img = document.createElement('img')
        li.id = charObj.id
        img.src = charObj.imageUrl
        const span = spanFinder(charObj)
        if(charObj.fav !== 'yes') span.classList.toggle('favored')
        // console.log(span)
        img.addEventListener('click', () => renderMainFromFavs(charObj, span))
        li.append(img)
        favList.append(li)
    }

    // Split renderMain into two functions:
    //  1. renderMainFromNav
    //      - add conditional check if in favsList
    // Fix delete function

    function renderMainFromFavs(charObj, span) {
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
            span.className = ''
            favBtn.textContent = 'Favorite'
            document.getElementById(charObj.id).remove()
            deleteFav(charObj.id)
            renderMain(charObj)
        })
        main.append(fullName, houseName, title, image, br, favBtn)
    }

    function renderMain(charObj, span) {
        
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
     
        // theRightSpan = spanFinder(charObj)
        favBtn.addEventListener('click', () => {
            
            span.className = 'favored'
            favBtn.textContent = 'Remove From Favorites'
            
            postFav(charObj)
            renderMainFromFavs(charObj)
            })
        main.append(fullName, houseName, title, image, br, favBtn)
    }

    function spanFinder(charObj) {
        for(span of allSpans) {
            if(span.textContent === charObj.fullName) return span        
    }}

    function postFav(charObj) {
        fetch('http://localhost:3000/favorites', {
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
            .then(charObj => {
                renderFav(charObj)})
    }

    function deleteFav(id) {
        fetch(`http://localhost:3000/favorites/${id}`, {
            method: 'DELETE'
        })    
    }

    //renderFavContainer to render whole favorites container
    //renderFav to add a single item to favorites
    //deleteFav to remove a single item to favorites



})