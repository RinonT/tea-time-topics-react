import { main, nextTopicContainer, pastTopicContainer, form } from "./variables.js";
import { generateHtml } from "./generateHtml.js";
// import { addTopics } from "./addTopics.js";

const endpoint = "https://gist.githubusercontent.com/Pinois/93afbc4a061352a0c70331ca4a16bb99/raw/6da767327041de13693181c2cb09459b0a3657a1/topics.json";
// This will keep the object
let topics = [];
// Fetxh the data
async function fetchTopics() {
    const respose = await fetch(`${endpoint}?`);
    let data = await respose.json();
    topics = data;


    // A function that displays the list of topics in the document
    function displayTopics() {
        const array = topics.map(topic => {
            // Calculate the upvoteScore
            let upvotes = topic.upvotes - topic.downvotes;
            const topicStore = {
                "id": topic.id,
                "upvotes": upvotes,
                "title": topic.title,
                "downvotes": topic.downvotes,
                "discussedOn": topic.discussedOn,

            }
            return topicStore;
        });
        // Sorting the topics 
        const sortedTopics = array.sort(function (a, b) {
            return b.upvotes - a.upvotes;
        });

        // Filter the next topic and give it its own conatainer in the doc
        const nextTopics = array.filter(topic => topic.discussedOn == '')
        const nextTopicHtml = generateHtml(nextTopics);
        nextTopicContainer.innerHTML = nextTopicHtml;

        // Filter the next topic and give it its own conatainer in the doc
        const pastTopics = array.filter(topic => topic.discussedOn !== '')
        const pastTopicHtml = generateHtml(pastTopics);
        pastTopicContainer.innerHTML = pastTopicHtml;
    }

    displayTopics()
    // Add topics
    const addTopics = async (e) => {
        form.addEventListener("submit", async (e) => {
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
            displayTopics(topics)
            form.reset();
            // main.dispatchEvent(new CustomEvent('topicUpdated'));
        })
    }

    addTopics();
    // displayTopics()
    // A function that handle the increment button, delete list and also delete icon that delete the list from the form
    const handleClick = e => {
        // Incrementing the score for each topic list
        const uppvoteButton = e.target.closest('button.upvotes_button');

        if (uppvoteButton) {
            // Find the id of the list which is in the button
            const idToIncrement = uppvoteButton.dataset.id;
            // Find the list through their id
            const incrementScore = topics.find(topic => topic.id === idToIncrement || topic.id == idToIncrement);
            incrementScore.upvotes++;
            // Call this function to display the scores in the html
            displayTopics()
            // main.dispatchEvent(new CustomEvent('topicUpdated'));
        }

        const downvoteButton = e.target.closest(".downvotes_button");
        // Decrement the scores
        if (downvoteButton) {
            // Find the id of the list which is in the button
            const idToDecrement = downvoteButton.dataset.id;
            // Find the list through their id
            const decrementScore = topics.find(topic => topic.id === idToDecrement || topic.id == idToDecrement);
            // Increment the score
            decrementScore.downvotes++;
            // Call this function to display the scores in the html
            displayTopics()
            // main.dispatchEvent(new CustomEvent('topicUpdated'));
        }


        // deleting the topic list
        const deleteTopicButton = e.target.closest("button.delete_button");
        if (deleteTopicButton) {
            // Find the id of the list which is in the button
            const idToDelete = deleteTopicButton.dataset.id;
            // Find the list through their id
            const topicsToKeep = topics.filter(topic => topic.id !== idToDelete || topic.id != idToDelete);
            topics = topicsToKeep

            // Filter the next topic and give it its own conatainer in the doc
            const filterTopicsToKeep = topics.filter(topic => topic.discussedOn !== '')
            const topicsToKeepHtml = generateHtml(filterTopicsToKeep);
            pastTopicContainer.innerHTML = topicsToKeepHtml;
        }

    }

    // Store to the localStorage
    // //get the array from ls
    const initLocalStorage = () => {
        const stringFromLs = localStorage.getItem('topics');
        const listItems = JSON.parse(stringFromLs);
        if (listItems) {
            topics = listItems;
            // displayTopics()
        } else {
            topics = [];
        }
        // main.dispatchEvent(new CustomEvent('topicUpdated'));
    };

    const updateLocalStorage = () => {
        localStorage.setItem('topics', JSON.stringify(topics));
    }

    // All event listeners
    main.addEventListener('topicUpdated', updateLocalStorage);
    main.addEventListener('topicUpdated', displayTopics)
    main.addEventListener('click', handleClick)

    // initLocalStorage();
}

fetchTopics();