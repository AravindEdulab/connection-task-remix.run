import { json, redirect } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import { addColumnToUsersInAllDatabases } from '../utils/db';

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '4px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    color: '#2c3e50',
    marginBottom: '20px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    color: '#2c3e50',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
  },
  button: {
    backgroundColor: '#3498db',
    color: '#fff',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s ease',
  },
  errorMessage: {
    color: '#e74c3c',
    marginTop: '10px',
    textAlign: 'center',
  },
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  const columnName = formData.get('columnName');
  const columnType = formData.get('columnType');

  try {
    await addColumnToUsersInAllDatabases(columnName, columnType);
    return redirect('/success');
  } catch (error) {
    console.error(error);
    return json({ error: error.message }, { status: 500 });
  }
};

export default function AddColumn() {
  const actionData = useActionData();

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Add Column to Users Table</h1>
      <Form method="post" style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="columnName" style={styles.label}>Column Name:</label>
          <input type="text" id="columnName" name="columnName" required style={styles.input} />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="columnType" style={styles.label}>Column Type:</label>
          <input type="text" id="columnType" name="columnType" required style={styles.input} />
        </div>
        <button type="submit" style={styles.button}>Add Column</button>
      </Form>
      {actionData?.error && <p style={styles.errorMessage}>{actionData.error}</p>}
    </div>
  );
}