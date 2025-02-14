import { postgres } from './config';

class DatabaseService {
    private connection: any;

    constructor() {
        this.connect();
    }

    private connect() {
        const dbUrl = postgres.url;
        // Logic to connect to the database using dbUrl
        console.log(`Connecting to database at ${dbUrl}`);
        // Initialize connection here
    }

    // Add other methods for interacting with the database as needed
}

const dbService = new DatabaseService();

export default dbService;
