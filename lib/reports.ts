import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';

export type ReportType = 'patients' | 'examinations' | 'prescriptions' | 'inventory';

interface ReportConfig {
  title: string;
  headers: string[];
  dataMapping: (item: any) => string[];
}

const reportConfigs: Record<ReportType, ReportConfig> = {
  patients: {
    title: 'Patient Report',
    headers: ['ID', 'Name', 'Patient Number', 'Admission Date', 'Room', 'Ward'],
    dataMapping: (patient) => [
      patient.id,
      `${patient.firstName} ${patient.lastName}`,
      patient.patientNumber,
      new Date(patient.admissionDate).toLocaleDateString(),
      patient.room.roomNumber,
      patient.room.ward.name,
    ],
  },
  examinations: {
    title: 'Examination Report',
    headers: ['Date', 'Patient', 'Temperature', 'Blood Pressure', 'Pulse'],
    dataMapping: (exam) => [
      new Date(exam.examDate).toLocaleDateString(),
      `${exam.patient.firstName} ${exam.patient.lastName}`,
      `${exam.temperature}°C`,
      exam.bloodPressure,
      `${exam.pulse} bpm`,
    ],
  },
  prescriptions: {
    title: 'Prescription Report',
    headers: ['Date', 'Patient', 'Medication', 'Dosage', 'Duration'],
    dataMapping: (prescription) => [
      new Date(prescription.prescriptionDate).toLocaleDateString(),
      `${prescription.patient.firstName} ${prescription.patient.lastName}`,
      prescription.drug.name,
      prescription.dosage,
      `${prescription.treatmentLength} days`,
    ],
  },
  inventory: {
    title: 'Inventory Report',
    headers: ['Item Name', 'Category', 'Quantity', 'Min Quantity', 'Status'],
    dataMapping: (item) => [
      item.itemName,
      item.category,
      item.quantity.toString(),
      item.minQuantity.toString(),
      item.quantity <= item.minQuantity ? 'Low Stock' : 'Normal',
    ],
  },
};

export function generatePDF(type: ReportType, data: any[]) {
  const config = reportConfigs[type];
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text(config.title, 14, 15);
  doc.setFontSize(10);
  doc.text(`Generated on ${new Date().toLocaleString()}`, 14, 22);

  (doc as any).autoTable({
    head: [config.headers],
    body: data.map(config.dataMapping),
    startY: 30,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [66, 139, 202] },
  });

  doc.save(`${type}-report-${new Date().toISOString().split('T')[0]}.pdf`);
}

export function generateCSV(type: ReportType, data: any[]) {
  const config = reportConfigs[type];
  const csvData = [
    config.headers,
    ...data.map(config.dataMapping),
  ];

  const csv = Papa.unparse(csvData);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${type}-report-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}