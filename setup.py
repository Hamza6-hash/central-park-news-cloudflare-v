from setuptools import setup, find_packages

setup(
    name='blockchain_briefing',
    version='1.0.0',
    packages=find_packages(),
    include_package_data=True,
    install_requires=[
        'Flask==3.0.3',
        'crewai>=0.11.0',
        'duckduckgo-search>=4.4.2',
        'python-dotenv>=1.0.1',
        'requests>=2.31.0',
        'beautifulsoup4>=4.12.3',
        'firebase-admin==6.5.0'
    ],
    python_requires='3.11',  # Specify your required Python version here
)
