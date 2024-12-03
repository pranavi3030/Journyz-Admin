import { useParams } from "react-router-dom";
import { Assessment, Employee, OpArea } from "../utilities/types";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import Modal from "../components/Modal";
import AssessmentResponses from "./AssessmentResponses";
import capitalizeFirstLetter from "../utilities/capitalizeFirstLetter";
import AggregateAssessmentResponses from "./AggregateAssessmentResponses";

const OpAreaDetails = () => {
  const { companyId, departmentId, opAreaId } = useParams<{
    companyId: string;
    departmentId: string;
    opAreaId: string;
  }>();

  const [opArea, setOpArea] = useState<OpArea | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(false);
  const [showIndividualModal, setShowIndividualModal] = useState(false);
  const [showAggregateModal, setShowAggregateModal] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment>({
    id: "",
    companyId: "",
    departmentId: "",
    operationalAreaId: "",
    employeeId: "",
    date: Timestamp.now(),
    responses: [],
    score: 0,
  });

  useEffect(() => {
    const fetchCompanyAndDepartmentName = async () => {
      if (companyId && departmentId) {
        const companyDoc = await getDoc(doc(db, "Companies", companyId));
        const companyData = companyDoc.data();
        if (companyData) {
          setCompanyName(companyData.name);
        }

        const departmentDoc = await getDoc(
          doc(db, "Companies", companyId, "Departments", departmentId)
        );
        const departmentData = departmentDoc.data();
        if (departmentData) {
          setDepartmentName(departmentData.name);
        }
      } else {
        console.error("companyId or departmentId is undefined");
      }
    };

    const fetchOpArea = async () => {
      setLoading(true);

      if (companyId && departmentId && opAreaId) {
        const opAreaDoc = await getDoc(
          doc(
            db,
            "Companies",
            companyId,
            "Departments",
            departmentId,
            "Operational_Areas",
            opAreaId
          )
        );
        const opAreaData = opAreaDoc.data() as OpArea;
        if (opAreaData) {
          setOpArea(opAreaData);
          setLoading(false);
        }
      } else {
        console.error("companyId, departmentId, or opAreaId is undefined");
        setLoading(false);
      }
    };

    const fetchAssessments = async () => {
      if (companyId && departmentId && opAreaId) {
        const assessmentCol = collection(db, "Assessments");
        console.log(opAreaId);
        const assessmentQuery = query(
          assessmentCol,
          where("operationalAreaId", "==", opAreaId)
        );
        const assessmentSnapshot = await getDocs(assessmentQuery);
        const assessmentListSnapshots = assessmentSnapshot.docs.map(
          async (assessmentDoc) => {
            const data = {
              ...assessmentDoc.data(),
              id: assessmentDoc.id,
            } as Assessment;

            const employeeDoc = await getDoc(
              doc(db, "Employees", data.employeeId)
            );
            const employeeData = employeeDoc.data();
            if (employeeData) {
              data.employee = employeeData as Employee;
            }

            console.log(data.responses);
            return data;
          }
        );
        const assessmentList = await Promise.all(assessmentListSnapshots);

        const sortedAssessmentList = assessmentList.sort((a, b) =>
          (a.date as Timestamp).toDate() > (b.date as Timestamp).toDate()
            ? -1
            : 1
        );

        setAssessments(sortedAssessmentList);
      } else {
        console.error("companyId, departmentId, or opAreaId is undefined");
      }
    };

    fetchCompanyAndDepartmentName();
    fetchOpArea();
    fetchAssessments();
  }, [companyId, departmentId, opAreaId]);

  const handleViewResponses = (assessmentId: string) => {
    const selectedAssessment = assessments.find(
      (assessment) => assessment.id === assessmentId
    );
    if (selectedAssessment) {
      setSelectedAssessment(selectedAssessment);
      setShowIndividualModal(true);
    }
  };

  return (
    <div className="opAreaDetails">
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
            Loading Operational Area Details...
          </span>
        </div>
      )}
      {opArea && (
        <div className="opArea">
          <h1 className="text-3xl font-bold mb-2">
            {capitalizeFirstLetter(opArea.name)}
          </h1>
          <h2 className="text-lg font-semibold mb-5">
            {capitalizeFirstLetter(companyName)} -{" "}
            {capitalizeFirstLetter(departmentName)}
          </h2>
          <h5 className="font-semibold mb-1">Description</h5>
          <p className="text-gray-600 mb-10">
            {capitalizeFirstLetter(opArea.description)}
          </p>
          <div className="flex gap-20 mb-5">
            {/* KPIs */}
            <div className="flex-grow">
              <h3 className="text-xl font-semibold mb-4">
                Key Performance Indicators
              </h3>
              {opArea.KPIs?.length ?? 0 > 0 ? (
                <ul className="list-disc ps-4">
                  {opArea.KPIs?.map((kpi, index) => (
                    <li key={index}>{capitalizeFirstLetter(kpi)}</li>
                  ))}
                </ul>
              ) : (
                <p className="italic text-gray-500">No KPIs added</p>
              )}
            </div>
            {/* Projects */}
            <div className="flex-grow">
              <h3 className="text-xl font-semibold mb-4">Projects</h3>
              {opArea.projects?.length ?? 0 > 0 ? (
                <ul className="list-disc ps-4">
                  {opArea.projects?.map((project, index) => (
                    <li key={index}>{capitalizeFirstLetter(project)}</li>
                  ))}
                </ul>
              ) : (
                <p className="italic text-gray-500">No Projects added</p>
              )}
            </div>
          </div>

          <h3 className="text-xl font-semibold mb-4">Special Initiatives</h3>
          {opArea.specialInitiatives?.length ?? 0 > 0 ? (
            <ul className="list-disc ps-4">
              {opArea.specialInitiatives?.map((specialInitiative, index) => (
                <li key={index}>{capitalizeFirstLetter(specialInitiative)}</li>
              ))}
            </ul>
          ) : (
            <p className="italic text-gray-500">No Special Initiatives added</p>
          )}
        </div>
      )}

      <h3 className="text-xl font-semibold mt-10 mb-4">
        List of Assessments{" "}
        {assessments.length > 0 && (
          <span
            className="text-blue-500 font-semibold cursor-pointer"
            onClick={() => setShowAggregateModal(true)}
          >
            (View Aggregate Responses)
          </span>
        )}
      </h3>
      {assessments.length > 0 ? (
        <table className="min-w-full bg-white table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 text-start">Employee</th>
              <th className="px-4 py-2 text-start">Employee Role</th>
              <th className="px-4 py-2 text-start">Date and Time</th>
              <th className="px-4 py-2 text-start">Responses</th>
            </tr>
          </thead>
          <tbody>
            {assessments.map((assessment, index) => (
              <tr
                className="hover:bg-blue-50 transition ease-out"
                key={assessment.id}
              >
                <td className="border px-4 py-2">
                  {"Employee " + (index + 1)}
                </td>
                <td className="border px-4 py-2">
                  {assessment.employee?.role}
                </td>
                <td className="border px-4 py-2">
                  {assessment.date.toDate().toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </td>
                <td className="border px-4 py-2">
                  <span
                    className="text-blue-500 font-semibold cursor-pointer"
                    onClick={() => handleViewResponses(assessment.id!)}
                  >
                    View Responses
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="italic text-gray-500">
          No Assessments for {opArea?.name} yet
        </p>
      )}

      {/* Individual */}
      <Modal
        open={showIndividualModal}
        children={<AssessmentResponses assessment={selectedAssessment} />}
        onClose={() => setShowIndividualModal(false)}
        size="medium"
      />

      {/* Cumulative */}
      <Modal
        open={showAggregateModal}
        children={<AggregateAssessmentResponses assessments={assessments} />}
        onClose={() => setShowAggregateModal(false)}
        size="extra-large"
      />
    </div>
  );
};

export default OpAreaDetails;
