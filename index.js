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
            li.textContent = char.fullName
            li.addEventListener('click', () => renderMain(char))
            charList.append(li)
        })
    }    

    function renderMain(char) {
        main.innerHTML = ''
        const fullName = document.createElement('h1')
        const houseName = document.createElement('h3')
        const image = document.createElement('img')
        const title = document.createElement('h3')
        fullName.textContent = 'Name: ' + char.fullName
        houseName.textContent = 'House/Family: ' + char.family
        title.textContent = 'Title: ' + char.title
        image.src = char.imageUrl
        
        main.append(fullName, houseName, title, image)
    }





})