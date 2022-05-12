document.addEventListener('DOMContentLoaded', () => {

    const charList = document.getElementById('char-list')
    const main = document.getElementById('main')
    const searchForm = document.getElementById('search-form')
    const dltBtn = document.createElement('button')
    const favList = document.getElementById('fav-list')
    let allSpans = document.getElementsByTagName('span')
    let objSpan = 'empty'
    let serachResults = [];
    let favArray;

    renderFavContainer()
    .then( (favCharArray) => {
        getFavArray(favCharArray)
        favCharArray.forEach(favCharObj => {
            //objSpan = spanFinder(favCharObj)
            //console.log("from renderFavContainer: ", objSpan)
            renderFav(favCharObj) //, objSpan)
        })
    });

    function getFavArray(favCharArray) {
        favArray = favCharArray;
    }

    function renderFavContainer() {
        return fetch('http://localhost:3000/favorites')
             .then(resp => resp.json())
 
     }

    fetch('https://thronesapi.com/api/v2/Characters')
        .then(resp => resp.json())
        .then(charArray => {
            // console.log(charArray)
            renderNav(charArray)
            formHandler(charArray)
            //favContainer(charArray)
        })

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
        charList.innerHTML = '';
        charArray.forEach(charObj => {
            const li = document.createElement('li')
            const span = document.createElement('span')
            span.textContent = charObj.fullName 
            span.addEventListener('click', (e) => {
                objSpan = e.target
                let favCharObj = favArray.find((favCharObj) => objSpan.textContent === favCharObj.fullName)
                //console.log("From renderNav favCharObj: ", favCharObj)
                //console.log("from renderNav e.listener: ", span)
                // if (favCharObj) console.log("yeah!")
                // else console.log('nope!')
                favCharObj ? renderMainFromFavs(favCharObj, objSpan) : renderMain(charObj, span);
            })
            li.append(span)
            charList.append(li)
            
        })
        // favCharArray.forEach(favChar => {
        //     span = spanFinder(favChar)
        //     span.className = 'favored'
        // })
    }    


    function renderFav(favCharObj) {
        const li = document.createElement('li')
        const img = document.createElement('img')
        //li.id = favCharObj.uniqueId
        li.id = favCharObj.id
        img.src = favCharObj.imageUrl
        //objSpan = spanFinder(charObj)
        //console.log('from renderFav: ',objSpan)
        //if(charObj.fav !== 'yes') span.classList.toggle('favored')
        //console.log(span)
        img.addEventListener('click', () => renderMainFromFavs(favCharObj))
        li.append(img)
        favList.append(li)
    }

    // Split renderMain into two functions:
    //  1. renderMainFromNav
    //      - add conditional check if in favsList
    // Fix delete function

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
        
        //objSpan = spanFinder(charObj)
        //console.log('from renderMain: ',   objSpan)
        favBtn.addEventListener('click', () => {
            postFav(charObj)
            .then((favCharObj) => {
            renderFav(favCharObj)
            //let favCharObj = favArray.find((favCharObj) => charObj.fullName === favCharObj.fullName)
            console.log("favCharObj from renderMain: ", favCharObj)
            console.log('renderMain charObj: ', charObj)
            renderMainFromFavs(favCharObj)})
        })
        main.append(fullName, houseName, title, image, br, favBtn)
    }

    function renderMainFromFavs(charObj) {
        main.innerHTML = ''
        //console.log('from renderMainFromFavs: ', objSpan)
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
            //objSpan.className = ''
            //favBtn.textContent = 'Favorite'
            //105 might be redundent?
            //document.getElementById(charObj.id).remove()
            deleteFav(charObj)
            renderMain(charObj)
        })
        main.append(fullName, houseName, title, image, br, favBtn)
    }

    // function spanFinder(char) {
    //     for(span of allSpans) {
    //         if(span.textContent === char.fullName) return console.log(span);
    // }}

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

    function deleteFav(charObj) {
        console.log('this is charobj be4 dlt: ',charObj)
        fetch(`http://localhost:3000/favorites/${charObj.id}`, {
            method: 'DELETE'
        })
        .then(() => {
            console.log("Id num from deleteFav: ", charObj.id)
            //console.log("obj for deletion (deleteFav): ", document.querySelector(`${charObj.uniqueId}`));
            document.getElementById(`${charObj.id}`).remove()
            //document.charObj.uniqueId
        })}

    //renderFavContainer to render whole favorites container
    //renderFav to add a single item to favorites
    //deleteFav to remove a single item to favorites



})