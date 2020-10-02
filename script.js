import { main, nextTopicContainer, pastTopicContainer, form } from "./variables.js";
import { generateHtml } from "./generateHtml.js";
// import { addTopics } from "./addTopics.js";
const endpoint = "https://gist.githubusercontent.com/Pinois/93afbc4a061352a0c70331ca4a16bb99/raw/6da767327041de13693181c2cb09459b0a3657a1/topics.json";

// Fetxh the data
export async function fetchTopics() { 
    const respose = await fetch(`${endpoint}?`);
    let data = await respose.json();
     return data
}
 
let topics = Array.from(fetchTopics());


// A function that displays the list of topics in the document
export async function displayTopics() {
    topics = await fetchTopics();
 
    // Filter the next topic and give it its own conatainer in the doc
    const nextTopics = topics.filter(topic => topic.discussedOn == '')
    const nextTopicHtml = await generateHtml(nextTopics);
    nextTopicContainer.innerHTML = nextTopicHtml;

    // Filter the next topic and give it its own conatainer in the doc
    const pastTopics = topics.filter(topic => topic.discussedOn !== '')
    const pastTopicHtml = await generateHtml(pastTopics);
    pastTopicContainer.innerHTML = pastTopicHtml;
    main.dispatchEvent(new CustomEvent('topicUpdated'));
}

// Add topics
const addTopics = async(e) => {
    topics = await fetchTopics()
    
    form.addEventListener("submit", async(e) => {
        e.preventDefault();
        const inputValue = e.target.topic.value;
         const newTopic = {
            "id": Date.now,
            "upvotes": 0,
            "title": inputValue,
            "downvotes": 0,
            "discussedOn": ""
         }
         topics.push(newTopic);
          
          // Filter the next topic and give it its own conatainer in the doc
        const nextTopicAdded = topics.filter(topic => topic.discussedOn == '')
        const nextTopicAddedHtml = await generateHtml(nextTopicAdded);
        nextTopicContainer.innerHTML = nextTopicAddedHtml;
        form.reset();
 
    })
       
}
addTopics();
// displayTopics()

// Store to the localStorage
//get the array from ls
const initLocalStorage = () => {
    const stringFromLs = localStorage.getItem('topics');
    const listItems = JSON.parse(stringFromLs);
    if(listItems) {
        topics = listItems;
        displayTopics()
    } else {
        topics = [];
    }
    main.dispatchEvent(new CustomEvent('topicUpdated'));

};

const updateLocalStorage = () => {
    localStorage.setItem('topics', JSON.stringify(topics));
}

// All event listeners
main.addEventListener('topicUpdated', updateLocalStorage);
main.addEventListener('topicUpdated', displayTopics)
initLocalStorage();
