const api = "https://api.dictionaryapi.dev/api/v2/entries/en/"

const word = document.getElementById('word')
const searchButton = document.getElementById("search")
const wordContainer = document.getElementById("wordContainer")
const errormsg = document.getElementById("errormsg")

// Colorfor parts of speech
const posColors = {
  noun:         "#4a6cf7",
  verb:         "#9b59b6",
  adjective:    "#27ae60",
  adverb:       "#e67e22",
  pronoun:      "#e74c3c",
  preposition:  "#1abc9c",
  conjunction:  "#f39c12",
  interjection: "#e91e63",
}

//  Fetch
async function fetchWord(userInput) {
  try {
    const response = await fetch(api + userInput)
    const data = await response.json()
    return data
  } catch (error) {
    console.log(`Error: ${error}`)
    return error
  }
}

//  Loading state 
function setLoading(isLoading) {
  searchButton.disabled = isLoading
  searchButton.innerHTML = isLoading
    ? `<div class="spinner"></div>`
    : `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
         class="bi bi-search" viewBox="0 0 16 16">
         <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0
         1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
       </svg>`
}

// Display
function displayDefinitions(data) {
  try {
    wordContainer.innerHTML = ""

    if (data.title === "No Definitions Found") {
      errormsg.textContent = data.message
      return
    }

    const searchedWord = data[0].word

    // word name + phonetic + audio button 
    const wordHeader = document.createElement("div")
    wordHeader.classList.add("word-header")

    const wordName = document.createElement("h1")
    wordName.textContent = searchedWord
    wordName.classList.add("searched-word")
    wordHeader.appendChild(wordName)

    // Find a entry that has audio
    const phonetics = data[0].phonetics || []
    const phoneticWithAudio = phonetics.find(p => p.audio && p.audio !== "")
    const phoneticText = data[0].phonetic || (phonetics[0] && phonetics[0].text) || ""

    if (phoneticText) {
      const phoneticEl = document.createElement("span")
      phoneticEl.classList.add("phonetic-text")
      phoneticEl.textContent = phoneticText
      wordHeader.appendChild(phoneticEl)
    }

    if (phoneticWithAudio) {
      const audioBtn = document.createElement("button")
      audioBtn.classList.add("audio-btn")
      audioBtn.title = "Play pronunciation"
      audioBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
          <path d="M11.536 14.01A8.47 8.47 0 0 0 14.026 8a8.47 8.47 0 0 0-2.49-6.01l-.708.707A7.48 7.48 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303z"/>
          <path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.48 5.48 0 0 1 11.025 8a5.48 5.48 0 0 1-1.61 3.89z"/>
          <path d="M10.025 8a4.486 4.486 0 0 1-1.318 3.182L8 10.475A3.49 3.49 0 0 0 9.025 8c0-.966-.392-1.841-1.025-2.475l.707-.707A4.49 4.49 0 0 1 10.025 8M7 4a.5.5 0 0 0-.812-.39L3.825 5.5H1.5A.5.5 0 0 0 1 6v4a.5.5 0 0 0 .5.5h2.325l2.363 1.89A.5.5 0 0 0 7 12z"/>
        </svg>`
      audioBtn.addEventListener("click", () => {
        new Audio(phoneticWithAudio.audio).play()
      })
      wordHeader.appendChild(audioBtn)
    }

    wordContainer.appendChild(wordHeader)

    // ── Cards ──
    const cardContainer = document.createElement("div")
    cardContainer.classList.add("card-container")

    for (let i = 0; i < data.length; i++) {
      data[i].meanings.forEach(meaning => {
        const card = document.createElement("div")
        card.classList.add("card")

        // Color-code the card top border by part of speech
        const color = posColors[meaning.partOfSpeech] || "#4a6cf7"
        card.style.borderTop = `4px solid ${color}`

        // Part of speech label
        const pos = document.createElement("p")
        pos.textContent = meaning.partOfSpeech
        pos.classList.add("pos-tag")
        pos.style.color = color
        card.appendChild(pos)

        // Definitions + examples (max 4)
        meaning.definitions.slice(0, 4).forEach(item => {
          const def = document.createElement("p")
          def.classList.add("definition")
          def.textContent = item.definition
          card.appendChild(def)

          if (item.example) {
            const example = document.createElement("p")
            example.classList.add("example")
            example.textContent = `"${item.example}"`
            card.appendChild(example)
          }
        })

        // Synonyms chips
        if (meaning.synonyms && meaning.synonyms.length > 0) {
          card.appendChild(buildChips("Synonyms", meaning.synonyms.slice(0, 5), "chip-syn"))
        }

        // Antonyms chips
        if (meaning.antonyms && meaning.antonyms.length > 0) {
          card.appendChild(buildChips("Antonyms", meaning.antonyms.slice(0, 5), "chip-ant"))
        }

        cardContainer.appendChild(card)
      })
    }

    wordContainer.appendChild(cardContainer)
    wordContainer.scrollIntoView({ behavior: "smooth" })

  } catch (error) {
    console.log(error)
  }
}

// ── Helper: build a chips row
function buildChips(label, words, chipClass) {
  const section = document.createElement("div")
  section.classList.add("chips-section")

  const labelEl = document.createElement("span")
  labelEl.classList.add("chips-label")
  labelEl.textContent = `${label}:`
  section.appendChild(labelEl)

  words.forEach(w => {
    const chip = document.createElement("span")
    chip.classList.add("chip", chipClass)
    chip.textContent = w
    chip.addEventListener("click", () => {
      word.value = w
      triggerSearch(w)
    })
    section.appendChild(chip)
  })

  return section
}

//  Central search trigger
async function triggerSearch(query) {
  errormsg.textContent = ""
  wordContainer.innerHTML = ""

  if (!query) {
    errormsg.textContent = "Please input a word"
    return
  }

  setLoading(true)
  const data = await fetchWord(query)
  setLoading(false)

  displayDefinitions(data)
  saveWord(query, data)
  renderSavedWords()
}

//  Event listeners 
searchButton.addEventListener("click", () => triggerSearch(word.value.trim()))
word.addEventListener("keydown", e => {
  if (e.key === "Enter") triggerSearch(word.value.trim())
})

//  Saved words 
function saveWord(w, data) {
  if (!data || data.title === "No Definitions Found") return
  const savedWords = JSON.parse(localStorage.getItem("savedWords")) || {}
  savedWords[w] = data
  localStorage.setItem("savedWords", JSON.stringify(savedWords))
}

function deleteWord(w) {
  const savedWords = JSON.parse(localStorage.getItem("savedWords")) || {}
  delete savedWords[w]
  localStorage.setItem("savedWords", JSON.stringify(savedWords))
  renderSavedWords()
}

function renderSavedWords() {
  const savedWords = JSON.parse(localStorage.getItem("savedWords")) || {}
  const list = document.getElementById("savedWordsList")
  list.innerHTML = ""

  if (Object.keys(savedWords).length === 0) {
    const empty = document.createElement("p")
    empty.classList.add("empty-saved")
    empty.textContent = "No saved words yet."
    list.appendChild(empty)
    return
  }

  Object.keys(savedWords).forEach(w => {
    const li = document.createElement("li")

    const wordSpan = document.createElement("span")
    wordSpan.textContent = w
    wordSpan.addEventListener("click", () => displayDefinitions(savedWords[w]))

    const deleteBtn = document.createElement("button")
    deleteBtn.classList.add("delete-btn")
    deleteBtn.innerHTML = "&times;"
    deleteBtn.title = "Remove"
    deleteBtn.addEventListener("click", e => {
      e.stopPropagation()
      deleteWord(w)
    })

    li.appendChild(wordSpan)
    li.appendChild(deleteBtn)
    list.appendChild(li)
  })
}

window.addEventListener("DOMContentLoaded", renderSavedWords)