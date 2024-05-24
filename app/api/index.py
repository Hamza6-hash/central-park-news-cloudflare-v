from threading import Thread
from crewai import Crew, Process
from langchain_openai import ChatOpenAI
from agents import AINewsLetterAgents
from tasks import AINewsLetterTasks
from flask import Flask, jsonify
import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv
import re

load_dotenv()

# Initialize Firebase Admin SDK
cred = credentials.Certificate('credentials.json')
firebase_admin.initialize_app(cred, {
     'databaseURL': 'https://newsletter-46054-default-rtdb.firebaseio.com/'
})
db = firestore.client()

# Initialize the agents and tasks
agents = AINewsLetterAgents()
tasks = AINewsLetterTasks()

# Initialize the OpenAI GPT-4 language model
OpenAIGPT4 = ChatOpenAI(model="gpt-4")

# Instantiate the agents
editor = agents.editor_agent()
news_fetcher = agents.news_fetcher_agent()
news_analyzer = agents.news_analyzer_agent()
newsletter_compiler = agents.newsletter_compiler_agent()

# Function to parse the markdown content and extract articles
def parse_articles(markdown_content):
    # Regular expression to match article sections
    pattern = re.compile(r'## \*\*(.*?)\*\*.*?---\s*(.*?)(?=## \*\*|$)', re.DOTALL)
    articles = []
    for match in pattern.finditer(markdown_content):
        title = match.group(1).strip()
        content = match.group(2).strip()
        articles.append({'title': title, 'content': content})
    return articles

def save_to_firebase(task_output):
    # Debugging: Print the task_output to understand its structure
    print("Task Output:", task_output)

    # Extract the markdown content from the TaskOutput object
    if hasattr(task_output, 'exported_output'):
        compiled_content = task_output.exported_output
    elif isinstance(task_output, dict) and 'exported_output' in task_output:
        compiled_content = task_output['exported_output']
    else:
        raise ValueError("Task output does not contain 'exported_output'")

    # Parse the markdown content to extract individual articles
    articles = parse_articles(compiled_content)
    
    # Save each article to Firebase Realtime Database
    ref = db.reference('newsletters')
    for article in articles:
        ref.push(article)
        print(f"Saved article '{article['title']}' to Firebase Realtime Database")

# Instantiate the tasks
fetch_news_task = tasks.fetch_news_task(news_fetcher)
analyze_news_task = tasks.analyze_news_task(news_analyzer, [fetch_news_task])
compile_newsletter_task = tasks.compile_newsletter_task(
    newsletter_compiler, [analyze_news_task], save_to_firebase)

# Form the crew
crew = Crew(
    agents=[editor, news_fetcher, news_analyzer, newsletter_compiler],
    tasks=[fetch_news_task, analyze_news_task, compile_newsletter_task],
    process=Process.hierarchical,
    manager_llm=OpenAIGPT4,
    verbose=2
)

# Flask app
app = Flask(__name__)

@app.route('/api', methods=['POST'])
def get_data():
    response_data = {'message': 'Hello from Flask!'}
    print("I am hitted")
    
    def kickoff_crew_work():
        results = crew.kickoff()
        print("Crew Work Results:", results)
    
    # Start the crew work in a separate thread
    crew_thread = Thread(target=kickoff_crew_work)
    crew_thread.start()
    
    return jsonify(response_data)

if __name__ == '__main__':
    app.run(debug=True, port=5328)
