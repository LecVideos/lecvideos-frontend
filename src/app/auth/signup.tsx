import React, { useState, useEffect } from "react";
import { apiFetcher } from "@/lib/utilities";

interface Department {
  _id: string;
  name: string;
  code: string;
    school: string;
    levels: number
}

interface SignupProps {
    switchToLogin: () => void;
}

interface School {
    _id: string;
    name: string;
    code: string
}



const SignupPage: React.FC<SignupProps> = ({switchToLogin}) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [password, setPassword] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [schools, setSchools] = useState<School[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [levels, setLevels] = useState<number[]>([]);

  // Fetch schools
  useEffect(() => {
    const fetchSchools = async () => {
      const schoolsResponse = await apiFetcher(`${process.env.NEXT_PUBLIC_ServerHost}/get-all-schools`, {method: "GET"})

      if(schoolsResponse?.statusCode == 200){
        setSchools(schoolsResponse.schools);
      }
      
    };

    fetchSchools();
  }, []);

  //Feth Departments of the selected school
  useEffect(() => {

    if (selectedSchool) {
      const fetchDepartments = async () => {
        const departmentsResponse = await apiFetcher(`${process.env.NEXT_PUBLIC_ServerHost}/get-school-departments?school=${selectedSchool}`, { method: "GET" });

        setDepartments(departmentsResponse.departments);
      };
  
      fetchDepartments();
    }
  }, [selectedSchool]);



  useEffect(() => {
    if (selectedDepartment) {
        const deptLevels = []
         for(let i = 1; i <= selectedDepartment.levels; i++){
            deptLevels.push(i * 100)

        }
        setLevels(deptLevels);
    }
  }, [selectedDepartment]);

  const handleDepartmentChange = (departmentId: string) => {
    const department = departments.find((d) => d._id === departmentId) || null;
    setSelectedDepartment(department);
  };

  const signup = async (e: React.FormEvent)=>{
    e.preventDefault()

    if (!firstName || !lastName || !email || !username || !phoneNo || !password || !selectedSchool || !selectedDepartment || !selectedLevel) {
      alert("Please fill out all fields!");
      return;
    }

    // Construct payload
    const signupData = {
      firstName,
      lastName,
      email,
      username,
      phoneNo,
      password,
      school: selectedSchool,
      department: selectedDepartment?._id,
      level: selectedLevel,
    };

    try {
      const response = await apiFetcher(`${process.env.NEXT_PUBLIC_ServerHost}/student/signup`, {
        method: "POST",
        body: JSON.stringify(signupData),
        headers: {
          "Content-Type": "application/json"
        }
      });
  
      if (response?.statusCode === 200) {
        console.log(response.responseData)
        alert("Signup successful!");
        // Optional: switch to login page
        //switchToLogin();
      } else {
        alert(response?.msg || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Something went wrong. Please try again later.");
    }

  }

  return (
    <div className="flex-1 bg-blue-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-blue-500 mb-6">Sign Up</h1>
        <form className="space-y-4" onSubmit={signup}>
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              id="firstName"
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setFirstName(e.target.value)}
              value={firstName}
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              id="lastName"
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setLastName(e.target.value)}
              value={lastName}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <input
              id="username"
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              id="phone"
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setPhoneNo(e.target.value)}
              value={phoneNo}
            />
          </div>
          <div>
            <label htmlFor="school" className="block text-sm font-medium text-gray-700">School</label>
            <select
              id="school"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
            >
              <option value="" disabled>Select a school</option>
              {schools.map((school) => (
                <option key={school._id} value={school._id}>
                  {`${school.name}(${school.code})`}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
            <select
              id="department"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={selectedDepartment?._id || ""}
              onChange={(e) => handleDepartmentChange(e.target.value)}
            >
              <option value="" disabled>Select a department</option>
              {departments.map((department) => (
                <option key={department._id} value={department._id}>
                  {department.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="level" className="block text-sm font-medium text-gray-700">Level</label>
            <select
              id="level"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
            >
              <option value="" disabled>Select a level</option>
              {levels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <button
            onClick={switchToLogin}
            className="text-blue-500 hover:underline"
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
