import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Company, Department } from "../utilities/types";
import { db } from "../firebase";
import capitalizeFirstLetter from "../utilities/capitalizeFirstLetter";

const Departments = () => {
  const { companyId } = useParams<{ companyId: string }>();

  const [company, setCompany] = useState<Company>({
    id: "1",
    name: "Company Name",
    address: "Company Address",
    industry: "Company Industry",
    score: "Company Score",
    size: "Company Size",
    years: "Company Years",
  });
  const [departments, setDepartments] = useState<Department[]>([]);
  const [originalDepartments, setOriginalDepartments] = useState<Department[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCompanyName = async () => {
      if (companyId) {
        const companyDoc = await getDoc(doc(db, "Companies", companyId));
        const companyData = companyDoc.data() as Company;
        if (companyData) {
          setCompany(companyData);
        }
      } else {
        console.error("companyId is undefined");
      }
    };

    const fetchDepartments = async () => {
      setLoading(true);

      if (companyId) {
        const departmentCol = collection(
          db,
          "Companies",
          companyId,
          "Departments"
        );
        const departmentSnapshot = await getDocs(departmentCol);
        const departmentList: Department[] = departmentSnapshot.docs.map(
          (doc) => {
            const data = { ...doc.data(), id: doc.id };
            return data as Department;
          }
        );

        const sortedDepartmentList = departmentList.sort((a, b) =>
          a.name.localeCompare(b.name)
        );

        const fetchOperationalAreasCount = async (departmentId: string) => {
          const operationalAreasCol = collection(
            db,
            "Companies",
            companyId,
            "Departments",
            departmentId,
            "Operational_Areas"
          );
          const operationalAreasSnapshot = await getDocs(operationalAreasCol);
          return operationalAreasSnapshot.size;
        };

        for (const department of departmentList) {
          department.opAreaCount = await fetchOperationalAreasCount(
            department.id!
          );
        }

        setDepartments(sortedDepartmentList);
        setOriginalDepartments(sortedDepartmentList);
        setLoading(false);
      } else {
        console.error("companyId is undefined");
      }
    };

    fetchCompanyName();
    fetchDepartments();
  }, [companyId]);

  useEffect(() => {
    if (searchTerm === "") {
      setDepartments(originalDepartments);
    } else {
      const filteredDepartments = originalDepartments.filter((department) =>
        department.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setDepartments(filteredDepartments);
    }
  }, [searchTerm, originalDepartments]);

  return (
    <div className="departments">
      <div className="company">
        <h1 className="text-3xl font-bold mb-2">
          {capitalizeFirstLetter(company.name)}
        </h1>
        <h2 className="font-semibold mb-5">{company.address}</h2>
        <div className="flex gap-10 mb-10 text-lg">
          <p>
            <span className="font-semibold">Industry:</span>{" "}
            {capitalizeFirstLetter(company.industry)}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">List of Deparments</h3>
        <div className="flex items-center gap-2 w-1/3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>

          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search Departments"
              className="border rounded px-2 py-1 w-full"
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
              value={searchTerm}
            />
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
          </div>
        </div>
      </div>

      {searchTerm && (
        <div className="text-gray-500 text-lg mt-5">
          Showing results for:{" "}
          <span className="font-semibold">"{searchTerm}"</span>
        </div>
      )}

      {departments && departments.length === 0 && !loading && (
        <div className="flex items-center justify-center h-40">
          {!searchTerm && (
            <span className="italic text-lg text-gray-600">
              No departments found for {capitalizeFirstLetter(company.name)}
            </span>
          )}
          {searchTerm && (
            <span className="italic text-lg text-red-600">
              No departments found with the search term "{searchTerm}"
            </span>
          )}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center gap-3 h-40">
          <div className="animate-spin">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 text-gray-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          </div>
          <span className="text-gray-500 text-xl font-semibold">
            Loading Departments...
          </span>
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-3 gap-5">
          {departments.map((department) => (
            <Link to={`/company/${companyId}/department/${department.id}`}>
              <div
                key={department.id}
                className="bg-gray-100 shadow rounded-lg p-5 mb-3 col-span-1 hover:shadow-md hover:text-blue-600 hover:bg-blue-100 transition cursor-pointer"
              >
                <h4 className="font-semibold mb-3">
                  {capitalizeFirstLetter(department.name)}
                </h4>
                <h5 className="text-sm">
                  {department.opAreaCount} Operational Area
                  {department.opAreaCount != 1 ? "s" : ""}
                </h5>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Departments;
