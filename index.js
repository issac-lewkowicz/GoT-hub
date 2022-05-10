document.addEventListener('DOMContentLoaded', () => {
    fetch('https://thronesapi.com/api/v2/Characters')
        .then(resp => resp.json())
        .then(charArray => {
            renderNav(charArray)
            formHandler(charArray)
        })

    const charList = document.getElementById('char-list')
    const main = document.getElementById('main')
    const searchForm = document.getElementById('search-form')
    const dltBtn = document.createElement('button')
    const favList = document.getElementById('fav-list')

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




    function renderNav(charArray) {
        charArray.forEach(char => {
            const li = document.createElement('li')
            const span = document.createElement('span')
            span.textContent = char.fullName
            span.addEventListener('click', () => renderMain(char))
            li.append(span)
            charList.append(li)
        })
    }    

    function renderFavs(charObj) {
        const li = document.createElement('li')
        const img = document.createElement('img')
        li.id = charObj.id
        img.src = charObj.imageUrl

        img.addEventListener('click', () => renderMain(charObj))
        li.append(img)
        favList.append(li)
    }

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
        // if(! favBtn.classList.contains('favored')) favBtn.textContent = 'Favorite';
        favBtn.addEventListener('click', () => {
            favBtn.classList.toggle('favored')
            console.log(favBtn)
            if(favBtn.classList.contains('favored')) {
                favBtn.textContent = 'Remove From Favorites'
                renderFavs(charObj)
                // Add to database
                // 
            } 
            else {
                favBtn.textContent = 'Favorite'
                document.getElementById(charObj.id).remove()
                // Remove list from DOM
                // Remove from database
                // Need to fix fav button rendering
            }
            })
        main.append(fullName, houseName, title, image, br, favBtn)
    }

    

    //renderFavs to render whole favorites container
    //renderOneFav to add a single item to favorites
    //deleteOneFav to remove a single item to favorites



})