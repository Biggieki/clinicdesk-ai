import { DEMO_CLINIC } from "@/lib/tenant/current-clinic";
import type { Patient } from "./types";

/**
 * FICTIONAL demonstration data only. None of these people exist.
 * Emails use the reserved example.com domain and phone numbers use a
 * non-routable "+000" prefix, so nothing here can reach a real person.
 * IDs are fixed (not random) so the sample data is identical on every load.
 * Newest first, which is how the table is displayed.
 */
const clinicId = DEMO_CLINIC.id;

export const MOCK_PATIENTS: Patient[] = [
  {
    id: "8d712092-bb9f-55ec-ba98-2bb33ed0b701", clinicId, patientNumber: "CD-1010",
    fullName: "Hodan Warsame", phone: "+000 555 0110", gender: "female", dateOfBirth: "1991-03-14",
    email: "hodan.warsame@example.com", status: "active", registeredAt: "2026-11-19T09:30:00.000Z",
  },
  {
    id: "f67bd4ec-b661-587d-a2bb-851ebdb0f4fc", clinicId, patientNumber: "CD-1009",
    fullName: "Maryan Abdi", phone: "+000 555 0109", gender: "female", dateOfBirth: "1984-09-02",
    email: "maryan.abdi@example.com", status: "active", registeredAt: "2026-11-17T11:05:00.000Z",
  },
  {
    id: "c32ff388-8d65-5339-925a-3a4ff51029e1", clinicId, patientNumber: "CD-1008",
    fullName: "Omar Yusuf", phone: "+000 555 0108", gender: "male", dateOfBirth: "1976-12-21",
    email: "", status: "active", registeredAt: "2026-11-12T08:15:00.000Z",
  },
  {
    id: "42e9d90a-1011-51df-9c2c-485f112d0a9b", clinicId, patientNumber: "CD-1007",
    fullName: "Fatima Ali", phone: "+000 555 0107", gender: "female", dateOfBirth: "2001-05-30",
    email: "fatima.ali@example.com", status: "active", registeredAt: "2026-11-08T13:40:00.000Z",
  },
  {
    id: "e3554466-c8dd-524f-91a0-d673232789f4", clinicId, patientNumber: "CD-1006",
    fullName: "Ahmed Mohamed", phone: "+000 555 0106", gender: "male", dateOfBirth: "1968-07-09",
    email: "ahmed.mohamed@example.com", status: "active", registeredAt: "2026-10-29T10:20:00.000Z",
  },
  {
    id: "e7704df3-8c5d-5cdc-a15d-62f9b93d3d9e", clinicId, patientNumber: "CD-1005",
    fullName: "Ismail Duale", phone: "+000 555 0105", gender: "male", dateOfBirth: "1999-01-18",
    email: "ismail.duale@example.com", status: "inactive", registeredAt: "2026-10-21T07:50:00.000Z",
  },
  {
    id: "3bdc5b9e-edf6-5048-bbe2-aa22bbcf398a", clinicId, patientNumber: "CD-1004",
    fullName: "Sahra Osman", phone: "+000 555 0104", gender: "female", dateOfBirth: "1955-11-05",
    email: "", status: "active", registeredAt: "2026-10-14T12:10:00.000Z",
  },
  {
    id: "ed038353-f4da-50d9-b675-0423438a6ad4", clinicId, patientNumber: "CD-1003",
    fullName: "Abdirahman Jama", phone: "+000 555 0103", gender: "male", dateOfBirth: "2012-04-27",
    email: "", status: "active", registeredAt: "2026-09-30T09:00:00.000Z",
  },
  {
    id: "dc651177-bb99-5bcb-9af1-73e5087f20d0", clinicId, patientNumber: "CD-1002",
    fullName: "Yasmin Farah", phone: "+000 555 0102", gender: "female", dateOfBirth: "1989-08-16",
    email: "yasmin.farah@example.com", status: "inactive", registeredAt: "2026-09-11T14:25:00.000Z",
  },
  {
    id: "2822ae43-1e24-505d-ba67-5f7c86fca274", clinicId, patientNumber: "CD-1001",
    fullName: "Khalid Hersi", phone: "+000 555 0101", gender: "male", dateOfBirth: "1972-02-03",
    email: "khalid.hersi@example.com", status: "active", registeredAt: "2026-08-25T08:45:00.000Z",
  },
];
