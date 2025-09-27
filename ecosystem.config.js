module.exports = {
  apps: [
    {
      name: 'dropout-prediction-backend',
      script: 'python',
      args: 'main.py',
      cwd: './backend',
      interpreter: 'none',
      env: {
        NODE_ENV: 'production',
        PORT: 8000
      }
    },
    {
      name: 'dropout-prediction-frontend',
      script: 'serve',
      args: '-s build -l 3000',
      cwd: './frontend',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
}