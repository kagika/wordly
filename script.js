const api = "https://api.dictionaryapi.dev/api/v2/entries/en/"

// This gets user input and search button
word = document.getElementById('word')
searchButton = document.getElementById("search")

// This identifies the container
wordContainer = document.getElementById("wordContainer")

// Retrieveing errormessage tag
errormsg = document.getElementById("errormsg")

// function for retreiveing data from dictionaryApi

async function fetchWord(userInput){
    try{
        response = await fetch(api+userInput)
        data = await response.json()
        return data
    }
    catch(error){
        console.log(`Here is the error: ${error}`)
        return error
    }
    
}

// function for accessing information about searched words
function displayDefinitions(data){
    try{
        wordContainer.innerHTML = ""

        if (data.title === "No Definitions Found"){
            errormsg.textContent = data.message
            return
        }
        // Extracting the searched word
        searchedWord = data[0].word
        wordName = document.createElement("h1")
        wordName.textContent = searchedWord
        // Creating a card container 
        const cardContainer = document.createElement("div")

        // Applying grid layout for the cards
        cardContainer.classList.add("card-container")

        // styling searched words
        wordName.classList.add('searched-word')

        wordContainer.appendChild(wordName)
        console.log(data)
        for (let index = 0; index < data.length; index++) {
            
            const wordElement = data[index];
            wordElement.meanings.forEach(individualWord => {
            const card = document.createElement("div")
            
            // styling individual cards
            card.classList.add("card")

                // Part of speech tag
                const partofspeechtag = document.createElement("p")
                partofspeechtag.textContent = individualWord.partOfSpeech
                card.appendChild(partofspeechtag)

                // limited to 4 defintions at a time 
                const sliced = individualWord.definitions.slice(0, 4)

                sliced.forEach((item) => {
                    // Definition
                    const def = document.createElement('p')
                    def.textContent = item.definition
                    // Styling for definitions
                    def.classList.add('definition') 
                    card.appendChild(def)

                    // Example (if it exists)
                    if (item.example) {
                        const example = document.createElement('p')
                        example.textContent = `"${item.example}"`
                        // Styling for examples
                        example.classList.add('example')
                        card.appendChild(example)
                    }
                })
                cardContainer.append(card)
                
                wordContainer.scrollIntoView({ 
                     behavior: "smooth" 
                    });
                console.log(wordContainer)
            })
            wordContainer.appendChild(cardContainer)
        }
    }
    catch(error){
        console.log(error)
    }
}

// Event listener for the button when user inputs
searchButton.addEventListener('click', function(){
    errormsg.textContent = ""
    wordContainer.innerHTML = "" 
    storedWord = word.value 
    if (!storedWord ){
        errormsg.textContent = "Please input a word"
    }
   return fetchWord(storedWord)
        .then(data =>{
            displayDefinitions(data)
            saveWord(storedWord, data)
            renderSavedWords()
        })

}
)

// Keeps track of saved words
function saveWord(word, data) {
    let savedWords = JSON.parse(localStorage.getItem("savedWords")) || {}

    savedWords[word] = data

    localStorage.setItem("savedWords", JSON.stringify(savedWords))
}

function renderSavedWords() {
    const savedWords = JSON.parse(localStorage.getItem("savedWords")) || {}
    const list = document.getElementById("savedWordsList")

    list.innerHTML = ""

    Object.keys(savedWords).forEach(word => {
        const li = document.createElement("li")
        li.textContent = word

        li.addEventListener("click", () => {
            displayDefinitions(savedWords[word])
        })

        list.appendChild(li)
    })
}
        
window.addEventListener("DOMContentLoaded", renderSavedWords)
li.addEventListener("click", () => {
    displayDefinitions(savedWords[word])

    document.querySelectorAll("#savedWordsList li")
        .forEach(el => el.classList.remove("active"))

    li.classList.add("active")
})
