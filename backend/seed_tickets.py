import requests
import json

BASE_URL = "http://localhost:8000/tickets/"

tickets = [
    {
        "title": "Main Database Connection Latency",
        "description": "Observed significant spikes in database response time (up to 5s) during peak hours. Needs immediate investigation of connection pool settings.",
        "domain": "Engineering",
        "priority": "Critical",
        "status": "In Progress"
    },
    {
        "title": "CI/CD Pipeline Failure on Main Branch",
        "description": "Build step failing due to dependency conflict in recent security patch. Affecting all production deployments.",
        "domain": "DevOps",
        "priority": "Critical",
        "status": "Open"
    },
    {
        "title": "Onboarding Workflow Optimization",
        "description": "Request to automate the employee hardware procurement step in the HR portal to reduce manual coordination.",
        "domain": "HR",
        "priority": "Medium",
        "status": "Open"
    },
    {
        "title": "Office Wi-Fi Connectivity Issues - Floor 3",
        "description": "Multiple reports of intermittent Wi-Fi drops on the north side of Floor 3. Suspected hardware failure in AP-04.",
        "domain": "IT",
        "priority": "High",
        "status": "In Progress"
    },
    {
        "title": "Q4 Budget Allocation Review",
        "description": "Annual review of departmental budgets for the final quarter. All domain leads need to submit their projections by Friday.",
        "domain": "Finance",
        "priority": "High",
        "status": "Open"
    },
    {
        "title": "Implement OAuth2 with Auth0",
        "description": "Migrate current JWT-based authentication to a fully managed Auth0 implementation for better security and MFA support.",
        "domain": "Engineering",
        "priority": "Medium",
        "status": "Closed"
    },
    {
        "title": "Server Resource Monitoring Alert",
        "description": "High CPU utilization detected on the staging Kubernetes cluster. Current usage at 92%. Scale up requested.",
        "domain": "DevOps",
        "priority": "High",
        "status": "In Progress"
    },
    {
        "title": "Laptop Replacement Request - Marketing",
        "description": "Graphic designer needs a hardware upgrade (RAM/GPU) to handle new 4K video rendering requirements.",
        "domain": "IT",
        "priority": "Low",
        "status": "Open"
    },
    {
        "title": "Quarterly Tax Filing Preparation",
        "description": "Consolidating all invoices and expense reports for the upcoming tax filing deadline. Ensuring compliance with new regulations.",
        "domain": "Finance",
        "priority": "Critical",
        "status": "In Progress"
    },
    {
        "title": "New Health Insurance Policy Update",
        "description": "Communicating the changes in the group health insurance policy to all employees. Drafting the announcement email.",
        "domain": "HR",
        "priority": "Low",
        "status": "Closed"
    }
]

def add_tickets():
    for i, ticket in enumerate(tickets):
        try:
            response = requests.post(BASE_URL, json=ticket)
            if response.status_code == 201:
                print(f"[{i+1}/10] Added: {ticket['title']}")
            else:
                print(f"[{i+1}/10] Failed: {ticket['title']} - {response.text}")
        except Exception as e:
            print(f"Error adding {ticket['title']}: {e}")

if __name__ == "__main__":
    add_tickets()
