import {generateImage} from "./ImageManager";

export const mapPatients = async (patientList) => {
    return patientList?.map((patient) => {
        return ({
            value: patient?.patientId,
            label: `${patient?.name}-${patient?.phoneNumber}`,
            flagPath: patient?.profileImage ? generateImage(patient?.profileImage) : ''
        })
    })
}