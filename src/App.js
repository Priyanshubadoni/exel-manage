import { useState } from "react";
import * as XLSX from "xlsx";

import './App.css';

function App() {

  const [validData, setValidData] = useState([]);
  const [invalidData, setInvalidData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e) => {
    const reader = new FileReader();
    reader.readAsBinaryString(e.target.files[0]);
    reader.onload = async (e) => {
      setLoading(true);
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);
      
      // Separate valid and invalid data
      const validRows = [];
      const invalidRows = [];
      parsedData.forEach(row => {
        if (row.status === 'valid') {
          validRows.push(row);
        } else {
          invalidRows.push(row);
        }
      });
      setValidData(validRows);
      setInvalidData(invalidRows);
      setAllData(parsedData); // Set all data

      // Sending data to the API
      try {
        const response = await fetch('https://6570054809586eff66409716.mockapi.io/apis', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(parsedData)
        });
        if (response.ok) {
          console.log('Data sent successfully');
        } else {
          console.error('Failed to send data');
        }
      } catch (error) {
        console.error('Error while sending data:', error);
      } finally {
        setLoading(false);
      }
    };
  }

  return (
    <div className="container mt-3">
  <div className="row">
    <div className="col">
      <input 
        type="file" 
        accept=".xlsx, .xls" 
        onChange={handleFileUpload} 
        className="form-control"
      />
    </div>
  </div>

  <div className="row">
    <div className="col">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h2>Valid Data ({validData.length})</h2>
          {validData.length > 0 && (
            <table className="table table-bordered">
              <thead className="thead-dark">
                <tr>
                  {Object.keys(validData[0]).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {validData.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value, index) => (
                      <td key={index}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
    <div className="col">
      {loading ? null : (
        <div>
          <h2>Invalid Data ({invalidData.length})</h2>
          {invalidData.length > 0 && (
            <table className="table table-bordered">
              <thead className="thead-dark">
                <tr>
                  {Object.keys(invalidData[0]).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {invalidData.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value, index) => (
                      <td key={index}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
    <div className="col">
      {loading ? null : (
        <div>
          <h2>All Data ({allData.length})</h2>
          {allData.length > 0 && (
            <table className="table table-bordered">
              <thead className="thead-dark">
                <tr>
                  {Object.keys(allData[0]).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allData.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value, index) => (
                      <td key={index}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  </div>
</div>
  );
}

export default App;
