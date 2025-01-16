const gracefulShutdown = (server) => {
    console.log('Shutting down gracefully...');
    server.close(() => {
      console.log('Closed all open connections.');
      process.exit(0); 
    });
  
    setTimeout(() => {
      console.error('Forced shutdown due to timeout.');
      process.exit(1);  
    }, 5000);  
  };
  
  const handleErrors = (server) => {
    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error.message);
      console.error(error.stack);
      gracefulShutdown(server);
    });
  
    process.on('unhandledRejection', (error) => {
      console.error('Unhandled Promise Rejection:', error.message);
      console.error(error.stack);
      gracefulShutdown(server);
    });
  
    process.on('SIGTERM', () => gracefulShutdown(server));
    process.on('SIGINT', () => gracefulShutdown(server));
  };
  
  module.exports = { handleErrors };
  