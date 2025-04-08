"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { logout, apiFetcher } from "@/lib/utilities";


interface DepartmentModel {
  _id: string;
  name: string;
  school: string;
  code: string;
}

interface SchoolModel {
  _id: string;
  name: string;
  code: string;
}

const UploadVideoForm = () => {
  const router = useRouter();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [selectedDepartments, setSelectedDepartments] = useState<DepartmentModel[]>([]);
  const [filteredDepartments, setFilteredDepartments] = useState<DepartmentModel[]>([]);
  const [departmentInput, setDepartmentInput] = useState("");
  const [date, setDate] = useState("");
  const [schools, setSchools] = useState<SchoolModel[]>([])
  const [selectedSchool, setSelectedSchool] = useState<SchoolModel | null>(null);
  const [role, setRole] = useState("")
  const [departments, setDepartments] = useState<DepartmentModel[]>([])

  useEffect(() => {
    const job = async () => {
      const jsonStoredUserData = localStorage.getItem("userData");
      if (!jsonStoredUserData) {
        await logout(router)
        return; 
      }
      const storedUserData = JSON.parse(jsonStoredUserData)
      setRole(storedUserData.role);

      if(storedUserData.role == "uploader" || storedUserData.role == "admin2"){
        const allDepartments = await apiFetcher(`${process.env.NEXT_PUBLIC_ServerHost}/protected-school-departments`, {method: 'GET'})
        setDepartments(allDepartments.data.departments)
        
      }
      else if(storedUserData.role == "admin1"){
        //get all schools
        const allSchools = await apiFetcher(`${process.env.NEXT_PUBLIC_ServerHost}/get-all-schools`, {method: 'GET'})
        setSchools(allSchools.data.schools)
      }
      
    }

    job()
  }, []);


  useEffect(() => {
    if (departmentInput) {
      setFilteredDepartments(
        departments.filter(
          (dept) =>
            dept.name.toLowerCase().includes(departmentInput.toLowerCase()) &&
            !selectedDepartments.some((selected) => selected.name === dept.name)
        )
      );
    } else {
      setFilteredDepartments([]);
    }
  }, [departmentInput, departments, selectedDepartments]);



  const handleAddDepartment = (dept: DepartmentModel) => {
    setSelectedDepartments([...selectedDepartments, dept]);
    setDepartmentInput("");
  };

  const handleRemoveDepartment = (deptId: string) => {
    setSelectedDepartments(selectedDepartments.filter(dept => dept._id !== deptId));
  };

  const handleSchoolChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const foundSchool = schools.find((s) => s._id === selectedId) || null;
    setSelectedSchool(foundSchool);
  
    if (foundSchool) {
      const res = await apiFetcher(`${process.env.NEXT_PUBLIC_ServerHost}/protected-school-departments?school=${foundSchool._id}`, {
        method: "GET",
      });
  
      if (res.data?.departments) {
        setDepartments(res.data.departments);
      }
    } else {
      setDepartments([]); // Optional: Clear departments if no school selected
    }
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    
    if (!videoFile) {
      alert("Please select a video file.");
      return;
    }

    if(selectedDepartments.length < 1){
      alert("Please select departments.");
      return;
    }


    const formData = new FormData();
    formData.append("file", videoFile);
    formData.append("title", title);
    formData.append("course", course);
    formData.append("date", date);
    if(selectedSchool) formData.append("school", selectedSchool._id);

    const departmentIds = selectedDepartments.map((dept) => dept._id);
    formData.append("departments", JSON.stringify(departmentIds));

    try {
      const res = await apiFetcher(`${process.env.NEXT_PUBLIC_ServerHost}/upload-video`, {method: "POST", body: formData})

  
      if (res.statusCode != 200) {
        alert(res.msg || "Something went wrong");
      }
  
      alert("Video uploaded successfully!");
      // Optionally redirect or reset form here
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed.");
    }
    
    
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4 p-4 bg-white rounded shadow-md">
      <input type="file" accept="video/*" required onChange={(e) => setVideoFile(e.target.files?.[0] || null)} />
      <input type="text" placeholder="Title" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
      <input type="text" placeholder="Course code" required value={course} onChange={(e) => setCourse(e.target.value)} className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>

      {role === "admin1" && (
        <select
          required
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedSchool?._id || ""}
          onChange={handleSchoolChange}
        >
          <option value="">Select a school</option>
          {schools.map((school) => (
            <option key={school._id} value={school._id}>
              {`${school.name}(${school.code})`}
            </option>
          ))}
        </select>
      )}


      <input
        type="text"
        placeholder="Departments"
        value={departmentInput}
        onChange={(e) => setDepartmentInput(e.target.value)}
        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {filteredDepartments.length > 0 && (
        <ul>
          {filteredDepartments.map((dept) => (
            <li key={dept._id} onClick={() => handleAddDepartment(dept)}>{dept.name}</li>
          ))}
        </ul>
      )}
      <div className="border grid grid-cols-2 gap-2 p-2">
        {selectedDepartments.map((dept) => (
          <span key={dept._id} className="relative bg-blue-100 text-blue-800 px-3 py-1 rounded-md flex items-center justify-between">
            {dept.name}
            <button
              type="button"
              onClick={() => handleRemoveDepartment(dept._id)}
              className="ml-2 text-sm text-red-500 hover:text-red-700 font-bold"
            >
              &times;
            </button>
          </span>
        ))}
      </div>

      <input type="date" value={date} required onChange={(e) => setDate(e.target.value)} className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>


      <button 
        type="submit"
        className="w-full bg-blue-500 text-white font-bold py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Submit
      </button>
    </form>
    
  );
};

export default UploadVideoForm;