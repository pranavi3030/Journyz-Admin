import { useEffect, useState } from "react";
import { Company } from "../utilities/types";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import capitalizeFirstLetter from "../utilities/capitalizeFirstLetter";

const Companies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [originalCompanies, setOriginalCompanies] = useState<Company[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCompaniesData = async () => {
      setLoading(true);
      const companyCol = collection(db, "Companies");
      const companySnapshot = await getDocs(companyCol);
      const companyList: Company[] = companySnapshot.docs.map((doc) => {
        const data = { ...doc.data(), id: doc.id };
        return data as Company;
      });

      const sortedCompanyList = companyList.sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      setCompanies(sortedCompanyList);
      setOriginalCompanies(sortedCompanyList);
      setLoading(false);
    };

    fetchCompaniesData();
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      setCompanies(originalCompanies);
    } else {
      const filteredCompanies = originalCompanies.filter((company) =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setCompanies(filteredCompanies);
    }
  }, [searchTerm, originalCompanies]);

  return (
    <div className="companies">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">
          List of Companies Currently in the Database
        </h3>
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
              placeholder="Search Companies"
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

      <h5 className="text-gray-500 mt-3">
        Click on a Company Name to view more details
      </h5>

      <div className="flex flex-col space-y-2 mt-5">
        {searchTerm !== "" && (
          <div className="text-gray-500 text-lg">
            Showing results for:{" "}
            <span className="font-semibold">"{searchTerm}"</span>
          </div>
        )}
        <table className="min-w-full bg-white table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 text-start font-semibold">Company</th>
              <th className="px-4 py-2 text-start font-semibold">Location</th>
              <th className="px-4 py-2 text-start font-semibold">Industry</th>
            </tr>
          </thead>
          <tbody>
            {companies &&
              companies.map((company) => (
                <tr className="hover:bg-blue-50 transition ease-out">
                  <td className="border px-4 py-2 text-blue-500 font-semibold">
                    <Link to={`/company/${company.id}`}>
                      {capitalizeFirstLetter(company.name)}
                    </Link>
                  </td>
                  <td className="border px-4 py-2">{company.address}</td>
                  <td className="border px-4 py-2">
                    {capitalizeFirstLetter(company.industry)}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {loading && (
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
              Loading Companies...
            </span>
          </div>
        )}
        {companies && companies.length === 0 && !loading && searchTerm && (
          <div className="flex items-center justify-center h-40">
            <span className="italic text-lg text-red-600">
              No companies found with the search term "{searchTerm}"
            </span>
          </div>
        )}
        {companies && companies.length === 0 && !loading && !searchTerm && (
          <div className="flex items-center justify-center h-40">
            <span className="italic text-2xl text-gray-500">
              No companies added yet
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Companies;
