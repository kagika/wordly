
const api = "https://api.dictionaryapi.dev/api/v2/entries/en/"

// This gets user input and search button
word = document.getElementById('word')
searchButton = document.getElementById("search")
errormsg = document.getElementById("errormsg")

// This identifies the container
wordContainer = document.getElementById("wordContainer")

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
        if (data.title ==="No Definitions Found" ){
            errormsg.textContent = data.message
        }
        console.log(data)

        for (let index = 0; index < data.length; index++) {
            const wordElement = data[index];
            wordName.textContent = wordElement.word
            wordElement.meanings.forEach(individualWord=>{

                // ptag for parts of speech
                partofspeechtag = document.createElement("p")
                partofspeechtag.textContent = individualWord.partOfSpeech
                wordContainer.appendChild(partofspeechtag)


            for (let index = 0; index < individualWord.definitions.length;index++){
                individualDefinition = individualWord.definitions[index].definition
                console.log(individualDefinition)
                    // ptage for definitions
                    def = document.createElement('p')
                    def.textContent = individualDefinition
                    partofspeechtag.appendChild(def)

                    // Condition if there are examples
                    individualExample = individualWord.definitions[index].example
                    if (individualExample){
                        // ptag for individual example
                        example = document.createElement('p')
                        example.textContent = `"${individualExample}"`
                        def.after(example)
                        console.log(example)
                    }

                }
            

            }) 


    }
    }
    catch(error){
        console.log()
    }

}

// Event listener for the button when user inputs
searchButton.addEventListener('click', function(){
    wordContainer.textContent = ""
    storedWord = word.value 
    if (!storedWord ){
        errormsg.textContent = "Please input a word"
    }
    fetchWord(storedWord)
        .then(displayDefinitions)

}
)

