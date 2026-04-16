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
        searchedWord = data[0].word
        wordName = document.createElement("h1")
        wordName.textContent = searchedWord
        wordContainer.appendChild(wordName)
        console.log(wordContainer)
        for (let index = 0; index < data.length; index++) {
            const wordElement = data[index];
            

            wordElement.meanings.forEach(individualWord => {

              
                const posDiv = document.createElement("div")

                // Part of speech tag
                const partofspeechtag = document.createElement("p")
                partofspeechtag.textContent = individualWord.partOfSpeech
                posDiv.appendChild(partofspeechtag)

                // limited to 4 defintions at a time 
                const sliced = individualWord.definitions.slice(0, 4)

                sliced.forEach((item) => {
                    // Definition
                    const def = document.createElement('p')
                    def.textContent = item.definition
                    posDiv.appendChild(def)

                    // Example (if it exists)
                    if (item.example) {
                        const example = document.createElement('p')
                        example.textContent = `"${item.example}"`
                        posDiv.appendChild(example)
                    }
                })
               
                wordContainer.appendChild(posDiv)
                
                console.log(wordContainer)
            })
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
        .then(displayDefinitions)

}
)
