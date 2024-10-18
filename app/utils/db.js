import mysql from "mysql2/promise";

const createPool = async () => {
  return mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
};

export const addColumnToUsersInAllDatabases = async (
  columnName,
  columnType
) => {
  const pool = await createPool();

  try {
    const [databases] = await pool.query("SHOW DATABASES LIKE 'university_%';");

    for (const db of databases) {
      const dbName = db[`Database (university_%)`];
      console.log(`Altering table in database: ${dbName}`);

      const query = `ALTER TABLE ${dbName}.users ADD COLUMN ${columnName} ${columnType};`;

      try {
        await pool.query(query);
        console.log(`Column ${columnName} added to ${dbName}.users`);
      } catch (err) {
        console.error(`Error updating ${dbName}: ${err.message}`);
        throw err;
      }
    }

    console.log("All databases updated");
  } catch (error) {
    console.error("Error in addColumnToUsersInAllDatabases:", error);
    throw error;
  } finally {
    await pool.end();
  }
};
