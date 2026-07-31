# Care Connect

Care Connect is a healthcare web application with:

- A React frontend
- A Flask ML backend for disease prediction
- A Flask weather-based health notices service

## Project Structure

- Target structure:
  - `apps/frontend/` - React application
  - `services/ml-backend/` - Disease prediction API
  - `services/health-notices/` - Health notices service
  - `third-party/mirotalkc2c-main/` - Isolated external project
- Current legacy folders:
  - `frontend/`
  - `ml_backend/`
  - `health notices/`

## Prerequisites

Install the following on your machine:

- Node.js 18+ and npm
- Python 3.10+

Check versions:

```bash
node -v
npm -v
python --version
```

## 1) Start the Frontend (React)

Open a terminal in the current frontend folder and run:

```bash
cd frontend
npm install
npm start
```

Frontend URL:

- `http://localhost:3000`

## 2) Start the ML Backend (Disease Predictor API)

Open a second terminal in the current backend folder and run:

```bash
cd ml_backend
```

### Create and activate virtual environment (first time only)

Windows (cmd):

```bat
python -m venv venv
venv\Scripts\activate
```

Install dependencies:

```bash
pip install flask flask-cors pandas numpy scikit-learn requests
```

Run the backend:

```bash
python app.py
```

Backend URL:

- `http://localhost:5000`

Health endpoint:

- `http://localhost:5000/api/health`

## 3) Start Health Notices Service (Optional but used by links)

Open a third terminal in the current health notices folder and run:

```bash
cd health-notices
```

### Create and activate virtual environment (first time only)

Windows (cmd):

```bat
python -m venv venv
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the service:

```bash
python src\frontend.py
```

Service URL:

- `http://127.0.0.1:5001`

## Run All Services Together

Use 3 terminals:

1. Frontend: `frontend` -> `npm start`
2. ML backend: `ml_backend` -> `python app.py`
3. Health notices: `health-notices` -> `python src\\frontend.py`

## Common Issues

### 1) `pip intall -r requirements.txt` fails

You likely typed `intall` instead of `install`.

Use:

```bash
pip install -r requirements.txt
```

### 2) Port already in use

If port `3000`, `5000`, or `5001` is busy, stop the old process using that port and restart.

### 3) Frontend cannot reach backend

Make sure these are running:

- ML backend on `http://localhost:5000`
- Health notices on `http://127.0.0.1:5001`

### 4) `Exit Code 127` in bash when running pip/python

This usually means the command or path is invalid for the current shell.

- In Git Bash, do not use `/c:/Users/...` paths.
- Use either:
  - `cd /c/Users/Asus/Desktop/Care-Connect`
  - or open Command Prompt/PowerShell and use `C:\Users\Asus\Desktop\Care-Connect`
- Run install commands from the correct folder:
  - `ml_backend` for ML backend dependencies
  - `health-notices` for `requirements.txt`

Example for health notices (Git Bash):

```bash
cd /c/Users/Asus/Desktop/Care-Connect/health-notices
python -m pip install -r requirements.txt
python src/frontend.py
```

## Notes

- The frontend no longer depends on Supabase.
