from threading import Thread
from crewai import Crew, Process
from langchain_openai import ChatOpenAI
from agents import AINewsLetterAgents
from tasks import AINewsLetterTasks
from file_io import save_markdown

from dotenv import load_dotenv
load_dotenv()

# Initialize the agents and tasks
agents = AINewsLetterAgents()
tasks = AINewsLetterTasks()

# Initialize the OpenAI GPT-4 language model
OpenAIGPT4 = ChatOpenAI(
    model="gpt-4"
)

# Instantiate the agents
editor = agents.editor_agent()
news_fetcher = agents.news_fetcher_agent()
news_analyzer = agents.news_analyzer_agent()
newsletter_compiler = agents.newsletter_compiler_agent()

# Instantiate the tasks
fetch_news_task = tasks.fetch_news_task(news_fetcher)
analyze_news_task = tasks.analyze_news_task(news_analyzer, [fetch_news_task])
compile_newsletter_task = tasks.compile_newsletter_task(
    newsletter_compiler, [analyze_news_task], save_markdown)

# Form the crew
crew = Crew(
    agents=[editor, news_fetcher, news_analyzer, newsletter_compiler],
    tasks=[fetch_news_task, analyze_news_task, compile_newsletter_task],
    process=Process.hierarchical,
    manager_llm=OpenAIGPT4,
    verbose=2
)

# Kick off the crew's work

# Print the results
# print("Crew Work Results:")

from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/api', methods=['POST'])
def get_data():
    response_data = {
        'message': 'Hello from Flask!'
    }
    print("I am hitted")
    
    # def kickoff_crew_work():
    #     results = crew.kickoff()
    #     print("Crew Work Results:", results)
    
    # # Start the crew work in a separate thread
    # crew_thread = Thread(target=kickoff_crew_work)
    # crew_thread.start()
    
    return jsonify(response_data)

if __name__ == '__main__':
    app.run(debug=True, port=5328)
    