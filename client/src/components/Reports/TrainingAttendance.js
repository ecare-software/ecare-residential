import React, { Component } from "react";
import Axios from "axios";
import styled from "styled-components";
import ClipLoader from "react-spinners/ClipLoader";

const API_BASE = process.env.REACT_APP_API_BASE || "";

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled.h2`
  margin: 0;
`;

const BackButton = styled.button`
  padding: 10px 20px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #5a6268;
  }
`;

const UploadSection = styled.div`
  background-color: #f8f9fa;
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  padding: 30px;
  margin-bottom: 30px;
  text-align: center;
`;

const UploadForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-width: 500px;
  margin: 0 auto;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
`;

const UploadButton = styled.button`
  padding: 12px 24px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: #218838;
  }

  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
`;

const AttendanceList = styled.div`
  display: grid;
  gap: 15px;
`;

const AttendanceCard = styled.div`
  background-color: white;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const CardInfo = styled.div`
  flex: 1;
`;

const CardTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #333;
`;

const CardDate = styled.p`
  margin: 0;
  color: #6c757d;
  font-size: 14px;
`;

const CardActions = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;

  &.view {
    background-color: #007bff;
    color: white;
    &:hover {
      background-color: #0056b3;
    }
  }

  &.delete {
    background-color: #dc3545;
    color: white;
    &:hover {
      background-color: #c82333;
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #6c757d;
`;

export class TrainingAttendance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      attendanceSheets: [],
      isLoading: true,
      isUploading: false,
      trainingName: "",
      trainingDate: "",
      selectedFile: null,
    };
  }

  componentDidMount() {
    this.loadAttendanceSheets();
  }

  loadAttendanceSheets = async () => {
    try {
      this.setState({ isLoading: true });
      const response = await Axios.get(`/api/trainingAttendance?homeId=${this.props.userObj.homeId}`);
      
      // Sort by date descending (newest first)
      const sortedSheets = response.data.sort((a, b) => 
        new Date(b.trainingDate) - new Date(a.trainingDate)
      );
      
      this.setState({ 
        attendanceSheets: sortedSheets,
        isLoading: false 
      });
    } catch (error) {
      console.error("Error loading attendance sheets:", error);
      alert("Failed to load attendance sheets");
      this.setState({ isLoading: false });
    }
  };

  handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        alert("Please upload a PDF or image file (JPEG, JPG, PNG)");
        e.target.value = "";
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        e.target.value = "";
        return;
      }
      
      this.setState({ selectedFile: file });
    }
  };

  handleUpload = async () => {
    const { trainingName, trainingDate, selectedFile } = this.state;

    if (!trainingName || !trainingDate || !selectedFile) {
      alert("Please fill in all fields and select a file");
      return;
    }

    try {
      this.setState({ isUploading: true });

      const formData = new FormData();
      formData.append("attendanceSheet", selectedFile);
      formData.append("trainingName", trainingName);
      formData.append("trainingDate", trainingDate);
      formData.append("uploadedBy", this.props.userObj.email);
      formData.append("uploadedByName", `${this.props.userObj.firstName} ${this.props.userObj.lastName}`);

      console.log("Uploading attendance sheet:", {
        trainingName,
        trainingDate,
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
      });

      const response = await Axios.post("/api/trainingAttendance", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Upload response:", response);

      alert("Attendance sheet uploaded successfully!");
      
      // Reset form
      this.setState({
        trainingName: "",
        trainingDate: "",
        selectedFile: null,
        isUploading: false,
      });
      
      // Clear file input
      document.getElementById("fileInput").value = "";
      
      // Reload sheets
      this.loadAttendanceSheets();
    } catch (error) {
      console.error("Error uploading attendance sheet:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      
      const errorMessage = error.response?.data?.error || error.message || "Unknown error";
      alert(`Failed to upload attendance sheet: ${errorMessage}`);
      this.setState({ isUploading: false });
    }
  };

  handleDelete = async (id, fileName) => {
    if (!window.confirm(`Are you sure you want to delete "${fileName}"?`)) {
      return;
    }

    try {
      await Axios.delete(`/api/trainingAttendance/${id}`);
      alert("Attendance sheet deleted successfully!");
      this.loadAttendanceSheets();
    } catch (error) {
      console.error("Error deleting attendance sheet:", error);
      alert("Failed to delete attendance sheet");
    }
  };

  handleView = (fileUrl, isLocal) => {
    const fullUrl = isLocal ? fileUrl : `${API_BASE}${fileUrl}`;
    window.open(fullUrl, "_blank");
  };

  render() {
    const { isLoading, isUploading, attendanceSheets, trainingName, trainingDate, selectedFile } = this.state;

    return (
      <Container>
        <Header>
          <Title>Training Attendance Sheets</Title>
          <BackButton onClick={this.props.resetReports}>
            ← Back to Reports
          </BackButton>
        </Header>

        {/* Upload Section */}
        <UploadSection>
          <h3>Upload New Attendance Sheet</h3>
          <UploadForm>
            <Input
              type="text"
              placeholder="Training Name"
              value={trainingName}
              onChange={(e) => this.setState({ trainingName: e.target.value })}
            />
            <Input
              type="date"
              value={trainingDate}
              onChange={(e) => this.setState({ trainingDate: e.target.value })}
            />
            <Input
              id="fileInput"
              type="file"
              accept="application/pdf,image/*"
              onChange={this.handleFileSelect}
            />
            {selectedFile && (
              <p style={{ margin: 0, fontSize: "14px", color: "#6c757d" }}>
                Selected: {selectedFile.name}
              </p>
            )}
            <UploadButton
              onClick={this.handleUpload}
              disabled={isUploading || !trainingName || !trainingDate || !selectedFile}
            >
              {isUploading ? "Uploading..." : "Upload Attendance Sheet"}
            </UploadButton>
          </UploadForm>
        </UploadSection>

        {/* Attendance Sheets List */}
        {isLoading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <ClipLoader size={50} color={"#ffc107"} />
            <p>Loading attendance sheets...</p>
          </div>
        ) : attendanceSheets.length === 0 ? (
          <EmptyState>
            <h3>No attendance sheets uploaded yet</h3>
            <p>Upload your first training attendance sheet above</p>
          </EmptyState>
        ) : (
          <AttendanceList>
            {attendanceSheets.map((sheet) => (
              <AttendanceCard key={sheet._id}>
                <CardInfo>
                  <CardTitle>{sheet.trainingName}</CardTitle>
                  <CardDate>
                    Date: {new Date(sheet.trainingDate).toLocaleDateString()} | 
                    Uploaded by {sheet.uploadedByName} on {new Date(sheet.uploadDate).toLocaleDateString()}
                  </CardDate>
                </CardInfo>
                <CardActions>
                  <ActionButton
                    className="view"
                    onClick={() => this.handleView(sheet.fileUrl, sheet._isLocal)}
                  >
                    View
                  </ActionButton>
                  <ActionButton
                    className="delete"
                    onClick={() => this.handleDelete(sheet._id, sheet.trainingName)}
                  >
                    Delete
                  </ActionButton>
                </CardActions>
              </AttendanceCard>
            ))}
          </AttendanceList>
        )}
      </Container>
    );
  }
}