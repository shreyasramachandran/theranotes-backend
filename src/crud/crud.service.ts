/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';


@Injectable()
export class CrudService {
    prisma = new PrismaClient()

    async getAllSeekers(clerkUserId: string): Promise<any> {
        // Fetch the session to get the associated user
        const therapist = await this.prisma.therapists.findFirst({
            where: { clerkUserId: clerkUserId }
        });
        if (!therapist) {
            return {}
        }
        // Fetch seekers and their attributes associated with this user
        const seekerDetails = await this.prisma.seekers.findMany({
            where: {
                OR: [
                    { therapist: { id: therapist.id } }
                ],
            },
            include:
            {
                SeekerAttributes: {
                    select: {
                        numberOfSessionsDone: true,
                        nextSessionScheduled: true,
                        preferredDayAndTime: true,
                        lastSessionPaymentDone: true,
                        isActive: true,
                        problemType: true
                    }
                },
                IntakeInformation: {
                    select: {
                        currentFees: true,
                    }
                },
                BasicDemographicDetails: {
                    select: {
                        contactNumber: true
                    }
                },
            },
        });

        interface InterfaceData {
            pid: string
            patientName: string
            sessionsDone: number
            nextSessionScheduled: boolean
            fees: number
            preferredDayAndTime: string
            therapist: string
            contactNo: string
            problemType: string
            lastSessionPaymentDone: boolean
            isActive: boolean
        }

        // Transform the data to be sent to frontend
        function transformData(sourceArray: any): InterfaceData[] {
            return sourceArray.map((item, index) => {
                return {
                    pid: item.id, // assuming id is convertible to number
                    patientName: `Patient ${index + 1}`, // Placeholder, as the real name is not in the source
                    sessionsDone: item.SeekerAttributes?.numberOfSessionsDone ?? null,
                    nextSessionScheduled: item.SeekerAttributes?.nextSessionScheduled === 1 ?? null,
                    fees: 100, // Placeholder value
                    preferredDayAndTime: item.SeekerAttributes?.preferredDayAndTime ?? null,
                    therapist: item.therapistId,
                    contactNo: '123-456-7890', // Placeholder value
                    problemType: item.SeekerAttributes?.problemType ?? null,
                    lastSessionPaymentDone: item.SeekerAttributes?.lastSessionPaymentDone === 1 ?? null,
                    isActive: item.isActive?.lastSessionPaymentDone === 'Yes' ?? null
                };
            });
        }
        const transformedSeekerDetails = transformData(seekerDetails)
        return transformedSeekerDetails;
    }

    async getAllSeekersCohortCards(clerkUserId: string): Promise<any> {
        // Fetch the session to get the associated user
        const therapist = await this.prisma.therapists.findFirst({
            where: { clerkUserId: clerkUserId }
        });

        if (!therapist) {
            return {}
        }
        const seekerDetails = await this.prisma.seekers.findMany({
            where: {
                OR: [
                    { therapist: { id: therapist.id } }
                ],
            },
            select:
            {
                id: true,
                IntakeInformation: {
                    select: {
                        name: true,
                    }
                },
            },
        });

        interface InterfaceData {
            seekerId: string
            name: string
            tag: string
            joiningTime: string
        }

        // Transform the data to be sent to frontend
        function transformData(sourceArray: any): InterfaceData[] {
            return sourceArray.map(item => ({
                seekerId: item.id,
                name: item.IntakeInformation?.name ?? null,
                tag: "Active Cohort",
                joiningTime: "Dec 2021" // Placeholder, replace with actual logic if available
            }));

        }
        const transformedSeekerDetails = transformData(seekerDetails)
        return transformedSeekerDetails;
    }

    async getSeekerProgress(seekerId: string): Promise<any> {
        const seekerProgressDetails = await this.prisma.seekerProgress.findMany(
            {
                where: {
                    seekerId: seekerId
                },
                select: {
                    id: true,
                    progressSubject: true,
                    progressBody: true,
                    createdAt: true
                }
            }
        )

        interface InterfaceData {
            seekerProgressId: string
            progressSubject: string
            progressBody: string
            createdAt: string
        }

        // Transform the data to be sent to frontend
        function transformData(sourceArray: any): InterfaceData[] {
            return sourceArray.map(item => ({
                seekerProgressId: item.id,
                progressSubject: item.progressSubject,
                progressBody: item.progressBody,
                time: item.createdAt
            }));

        }
        const transformedSeekerDetails = transformData(seekerProgressDetails)
        return transformedSeekerDetails;
    }

    // Create new seeker progress
    async createSeekerProgress(data: { seekerId: string, progressSubject: string, progressBody: string }): Promise<any> {
        return this.prisma.seekerProgress.create({
            data: {
                progressSubject: data.progressSubject,
                progressBody: data.progressBody,
                seeker: { // Assuming Seeker is the relation field name in SeekerProgress model
                    connect: { id: data.seekerId },
                },
            },
        });
    }

    // Edit new seeker progress
    async editSeekerProgress(data: { seekerProgressId: string, progressSubject: string, progressBody: string }): Promise<any> {
        return this.prisma.seekerProgress.update({
            where: { id: data.seekerProgressId },
            data: {
                progressSubject: data.progressSubject,
                progressBody: data.progressBody
            },
        });
    }

    // Delete seeker progress
    async deleteSeekerProgress(data: { seekerProgressId: string }): Promise<any> {
        return this.prisma.seekerProgress.delete({
            where: { id: data.seekerProgressId }
        });
    }


    async createNewTherapist(data): Promise<any> {
        return this.prisma.therapists.create({
            data: data
        });
    }


    async updateExistingTherapist(data: { clerkUserId: string, updatedData: any }): Promise<any> {
        return this.prisma.therapists.update({
            where: { clerkUserId: data.clerkUserId },
            data: data.updatedData
        });
    }

    // Function to create new seeker and associated clinical history. All the clinical history tables would be empty n
    async createNewSeekerAndClinicalHistory(data: { clerkUserId: string, seekerData: any }): Promise<any> {
        // Fetch the session to get the associated user
        const therapist = await this.prisma.therapists.findFirst({
            where: { clerkUserId: data.clerkUserId }
        });
        if (!therapist) {
            return {}
        }
        return this.prisma.seekers.create({
            data: {
                therapist: {
                    connect: { id: therapist.id },
                },
                // Add Seeker data
                referralSourcePlatform: data.seekerData.referralSourcePlatform,
                initialCommentsByTherapist: data.seekerData.initialCommentsByTherapist,
                // ... other seeker fields
                SeekerAttributes: {
                    create: {} // Object with seekerAttributes fields. Is empty
                },
                IntakeInformation: {
                    create: data.seekerData.IntakeInformation // Object with intakeInformation fields
                },
                BasicDemographicDetails: {
                    create: data.seekerData.basicDemographicDetails, // Object with basicDemographicDetails fields
                },
                PresentingProblem: {
                    create: {
                        EpisodicDocumentation: {
                            create: {}
                        },
                        HistoryOfPresentProblem: {
                            create: {}
                        }
                    }
                },
                EmergencyContact: {
                    create: {}
                },
                FamilyHistory: {
                    create: {}
                },
                Substances: {
                    create: {}
                },
                PreMorbidPersonality: {
                    create: {}
                },
                SexualHistory: {
                    create: {}
                },
                PersonalHistory: {
                    create: {}
                },
                PeersAndSocialHistory: {
                    create: {}
                },
                WorkAndCareer: {
                    create: {}
                },
                ProvisionalDiagnosis: {
                    create: {}
                },
                DifferentialDiagnosis: {
                    create: {}
                },
                MentalStatusExamination: {
                    create: {}
                }
            },
            include: {
                IntakeInformation: true,
                SeekerAttributes: true,
                BasicDemographicDetails: true,
                PresentingProblem: {
                    include: {
                        EpisodicDocumentation: true,
                        HistoryOfPresentProblem: true
                    }
                },
                EmergencyContact: true,
                FamilyHistory: true,
                Substances: true,
                PreMorbidPersonality: true,
                SexualHistory: true,
                PersonalHistory: true,
                PeersAndSocialHistory: true,
                WorkAndCareer: true,
                ProvisionalDiagnosis: true,
                DifferentialDiagnosis: true,
                MentalStatusExamination: true
            }
        });
    }

    async updateExistingSeekerAndClinicalInformation(data: { seekerId: string, updatedSeekerData: any }): Promise<any> {
        const updatedSeeker = await this.prisma.seekers.update({
            where: { id: data.seekerId },
            data: {
                IntakeInformation: {
                    update: {
                        statusOfInformedConsent: data.updatedSeekerData.IntakeInformation.statusOfInformedConsent,
                        currentFees: data.updatedSeekerData.IntakeInformation.currentFees,
                        mediumOfTherapy: data.updatedSeekerData.IntakeInformation.mediumOfTherapy,
                        intakeClinician: data.updatedSeekerData.IntakeInformation.intakeClinician,
                        keyTherapist: data.updatedSeekerData.IntakeInformation.keyTherapist
                    }
                }
            },
            include: {
                IntakeInformation: true,
            }
        });

        return updatedSeeker;
    }

    /*****
     * 
     * Get Functions begin here
     * 
     *****/

    async getPresentingProblem(seekerId: string): Promise<any> {
        const presentingProblemData = await this.prisma.presentingProblem.findMany({
            where: { seekerId: seekerId },
            include: {
                EpisodicDocumentation: {
                    select: {
                        timestamp: true,
                        verbatim: true,
                        onset: true,
                        duration: true,
                        course: true,
                        yourComments: true
                    }
                },
                HistoryOfPresentProblem: {
                    select: {
                        timestamp: true,
                        keySymptoms: true,
                        precipitatingFactors: true,
                        predisposingFactors: true,
                        perpetuatingFactors: true,
                        protectiveFactors: true,
                        summary: true
                    }
                }
            }
        })

        // Map it as according to how you want it to be rendered on frontend
        interface InterfaceData {
            clientWords: string
            onset: string
            duration: string
            keySymptoms: string
            precipitatingFactors: string
            predisposingFactors: string
            perpetuatingFactors: string
            protectiveFactors: string
            summary: string
            yourComments: string
        }

        // Transform the data to be sent to frontend
        function transformData(sourceArray: any): InterfaceData[] {
            return sourceArray.map(item => ({
                clientWords: item.EpisodicDocumentation.verbatim,
                onset: item.EpisodicDocumentation.onset,
                duration: item.EpisodicDocumentation.duration,
                keySymptoms: item.HistoryOfPresentProblem.keySymptoms,
                precipitatingFactors: item.HistoryOfPresentProblem.precipitatingFactors,
                predisposingFactors: item.HistoryOfPresentProblem.predisposingFactors,
                perpetuatingFactors: item.HistoryOfPresentProblem.perpetuatingFactors,
                protectiveFactors: item.HistoryOfPresentProblem.protectiveFactors,
                summary: item.HistoryOfPresentProblem.summary,
                yourComments: "This one is a fine specimin"
            }));

        }

        const transformedPresentingProblemData = transformData(presentingProblemData)
        return transformedPresentingProblemData;
    }

    async getBasicDemographicDetails(seekerId: string): Promise<any> {
        const data = await this.prisma.seekers.findMany({
            where: { id: seekerId },
            include: {
                IntakeInformation: {
                    select: {
                        name: true
                    }
                },
                BasicDemographicDetails: {
                    select: {
                        age: true,
                        dateOfBirth: true,
                        preferredPronoun: true,
                        contactNumber: true,
                        email: true,
                        currentAddress: true,
                        permanentAddress: true,
                        caste: true,
                        religion: true
                    }
                },
                FamilyHistory: {
                    select: {
                        familyStructure: true,
                    }
                }
            }
        })

        // Map it as according to how you want it to be rendered on frontend
        interface InterfaceData {
            name: string
            age: string
            dob: string
            preferredPronoun: string
            contactNum: string
            email: string
            currentAddress: string
            permanentAddress: string
            caste: string
            religion: string
            familyType: string
            ethnicity: string
            yourComments: string
        }

        // Transform the data to be sent to frontend
        function transformData(sourceArray: any): InterfaceData[] {
            return sourceArray.map(item => ({
                name: item.IntakeInformation?.name ?? null,
                age: item.BasicDemographicDetails?.age ?? null,
                dob: item.BasicDemographicDetails?.dateOfBirth ?? null,
                preferredPronoun: item.BasicDemographicDetails?.preferredPronoun ?? null,
                contactNum: item.BasicDemographicDetails?.contactNumber ?? null,
                email: item.BasicDemographicDetails?.email ?? null,
                currentAddress: item.BasicDemographicDetails?.currentAddress ?? null,
                permanentAddress: item.BasicDemographicDetails?.permanentAddress ?? null,
                caste: item.BasicDemographicDetails?.caste ?? null,
                religion: item.BasicDemographicDetails?.religion ?? null,
                familyType: item.FamilyHistory?.familyStructure ?? null,
                ethnicity: "Indian",
                yourComments: "No comments"
            }));

        }

        const transformedData = transformData(data)
        return transformedData;
    }

    async getEmergencyContact(seekerId: string): Promise<any> {
        const data = await this.prisma.seekers.findMany({
            where: { id: seekerId },
            include: {
                EmergencyContact: {
                    select: {
                        name: true,
                        relationship: true,
                        proximity: true,
                        contact: true
                    }
                }
            }
        })

        // Map it as according to how you want it to be rendered on frontend
        interface InterfaceData {
            name: string
            contactInfo: string
            proximity: string
            relationship: string
            yourComments: string
        }

        // Transform the data to be sent to frontend
        function transformData(sourceArray: any): InterfaceData[] {
            return sourceArray.map(item => ({
                name: item.EmergencyContact.name,
                contactInfo: item.EmergencyContact.contact,
                proximity: item.EmergencyContact.proximity,
                relationship: item.EmergencyContact.relationship,
                yourComments: "No comments"
            }));
        }

        const transformedData = transformData(data)
        return transformedData;
    }

    async getFamilyHistory(seekerId: string): Promise<any> {
        const data = await this.prisma.seekers.findMany({
            where: { id: seekerId },
            include: {
                FamilyHistory: {
                    select: {
                        familyStructure: true,
                        sourcesOfStress: true,
                        sourcesOfSupport: true,
                        mentalHealthHistoryInFamily: true
                    }
                }
            }
        })

        // Map it as according to how you want it to be rendered on frontend
        interface InterfaceData {
            familyStructure: string
            sourceOfStress: string
            sourceOfSupport: string
            mentalHealthHistory: string
            yourComments: string
        }

        // Transform the data to be sent to frontend
        function transformData(sourceArray: any): InterfaceData[] {
            return sourceArray.map(item => ({
                familyStructure: item.FamilyHistory.familyStructure,
                sourceOfStress: item.FamilyHistory.sourcesOfStress,
                sourceOfSupport: item.FamilyHistory.sourcesOfSupport,
                mentalHealthHistory: item.FamilyHistory.mentalHealthHistoryInFamily,
                yourComments: "No comments"
            }));
        }

        const transformedData = transformData(data)
        return transformedData;
    }

    async getSubstanceUsage(seekerId: string): Promise<any> {
        const data = await this.prisma.seekers.findMany({
            where: { id: seekerId },
            include: {
                Substances: {
                    select: {
                        introductionToSubstances: true,
                        substancesUsed: true,
                        frequency: true,
                        quantity: true,
                        reason: true
                    }
                }
            }
        })

        // Map it as according to how you want it to be rendered on frontend
        interface InterfaceData {
            introductionToSubstance: string
            substanceUsed: string
            frequency: string
            quantity: string
            reason: string
            yourComments: string
        }

        // Transform the data to be sent to frontend
        function transformData(sourceArray: any): InterfaceData[] {
            return sourceArray.map(item => ({
                introductionToSubstance: item.Substances.introductionToSubstances,
                substanceUsed: item.Substances.substancesUsed,
                frequency: item.Substances.frequency,
                quantity: item.Substances.quantity,
                reason: item.Substances.reason,
                yourComments: "No comments"
            }));
        }

        const transformedData = transformData(data)
        return transformedData;
    }

    async getPreMorbidPersonality(seekerId: string): Promise<any> {
        const data = await this.prisma.seekers.findMany({
            where: { id: seekerId },
            include: {
                PreMorbidPersonality: {
                    select: {
                        opennessToExperience: true,
                        conscientiousness: true,
                        extraversion: true,
                        agreeableness: true,
                        neuroticism: true,
                        introversion: true,
                        noveltySeeking: true,
                        impulsiveness: true,
                        perfectionism: true,
                        humour: true,
                        assertiveness: true,
                        empathy: true,
                        autonomy: true,
                        adaptivity: true,
                        altruism: true,
                        resilience: true,
                        patience: true,
                        curiosity: true,
                        creativity: true,
                        defiance: true,
                    }
                }
            }
        })

        // Map it as according to how you want it to be rendered on frontend
        interface InterfaceData {
            opennessToExpression: string,
            conscientiousness: string,
            extraversion: string,
            agreeableness: string,
            neuroticism: string,
            introversion: string,
            patience: string,
            curiosity: string,
            creativity: string,
            defiance: string,
            noveltySeeking: string,
            impulsiveness: string,
            perfectionism: string,
            humour: string,
            assertiveness: string,
            empathy: string,
            autonomy: string,
            adaptivity: string,
            altruism: string,
            resilience: string,
            comments: string
        }

        // Transform the data to be sent to frontend
        function transformData(sourceArray: any): InterfaceData[] {
            return sourceArray.map(item => ({
                opennessToExpression: item.PreMorbidPersonality?.opennessToExperience,
                conscientiousness: item.PreMorbidPersonality.conscientiousness,
                extraversion: item.PreMorbidPersonality.extraversion,
                agreeableness: item.PreMorbidPersonality.agreeableness,
                neuroticism: item.PreMorbidPersonality.neuroticism,
                introversion: item.PreMorbidPersonality.introversion,
                patience: item.PreMorbidPersonality.patience,
                curiosity: item.PreMorbidPersonality.curiosity,
                creativity: item.PreMorbidPersonality.creativity,
                defiance: item.PreMorbidPersonality.defiance,
                noveltySeeking: item.PreMorbidPersonality.noveltySeeking,
                impulsiveness: item.PreMorbidPersonality.impulsiveness,
                perfectionism: item.PreMorbidPersonality.perfectionism,
                humour: item.PreMorbidPersonality.humour,
                assertiveness: item.PreMorbidPersonality.assertiveness,
                empathy: item.PreMorbidPersonality.empathy,
                autonomy: item.PreMorbidPersonality.autonomy,
                adaptivity: item.PreMorbidPersonality.adaptivity,
                altruism: item.PreMorbidPersonality.altruism,
                resilience: item.PreMorbidPersonality.resilience,
                comments: "No comments"
            }));
        }

        const transformedData = transformData(data)
        return transformedData;
    }

    async getSexualHistory(seekerId: string): Promise<any> {
        const data = await this.prisma.seekers.findMany({
            where: { id: seekerId },
            include: {
                SexualHistory: {
                    select: {
                        onsetOfPuberty: true,
                        sexualIdentity: true,
                        genderIdentity: true,
                        firstSelfExplorationExperience: true,
                        firstSexualExperience: true,
                        arousalAndOrgasmicFantasy: true,
                        sexualDiseases: true,
                        currentSexualFunctioning: true,
                        sexualAbuse: true
                    }
                }
            }
        })

        // Map it as according to how you want it to be rendered on frontend
        interface InterfaceData {
            onsetOfPuberty: string
            genderIdentity: string
            fantasy: string
            firstSexualExperience: string
            sexualIdentity: string
            firstSelfExploration: string
            overallSexualFunctioning: string
            sexualDiseases: string
            sexualAbuse: string
            yourComments: string
        }

        // Transform the data to be sent to frontend
        function transformData(sourceArray: any): InterfaceData[] {
            return sourceArray.map(item => ({
                onsetOfPuberty: item.SexualHistory.onsetOfPuberty,
                genderIdentity: item.SexualHistory.genderIdentity,
                fantasy: item.SexualHistory.arousalAndOrgasmicFantasy,
                firstSexualExperience: item.SexualHistory.firstSexualExperience,
                sexualIdentity: item.SexualHistory.sexualIdentity,
                firstSelfExploration: item.SexualHistory.firstSelfExplorationExperience,
                overallSexualFunctioning: item.SexualHistory.currentSexualFunctioning,
                sexualDiseases: item.SexualHistory.sexualDiseases,
                sexualAbuse: item.SexualHistory.sexualAbuse,
                yourComments: "No comments"
            }));
        }

        const transformedData = transformData(data)
        return transformedData;
    }

    async getPersonalHistory(seekerId: string): Promise<any> {
        const data = await this.prisma.seekers.findMany({
            where: { id: seekerId },
            include: {
                PersonalHistory: {
                    select: {
                        yourComments: true,
                        perinatal: true,
                        childhood: true,
                        adolescent: true,
                        adulthood: true,
                        oldAge: true
                    }
                }
            }
        })

        // Map it as according to how you want it to be rendered on frontend
        interface InterfaceData {
            perinatal: string
            childhood: string
            adolescent: string
            adulthood: string
            oldAge: string
            yourComments: string
        }

        // Transform the data to be sent to frontend
        function transformData(sourceArray: any): InterfaceData[] {
            return sourceArray.map(item => ({
                perinatal: item.PersonalHistory.perinatal,
                childhood: item.PersonalHistory.childhood,
                adolescent: item.PersonalHistory.adolescent,
                adulthood: item.PersonalHistory.adulthood,
                oldAge: item.PersonalHistory.oldAge,
                yourComments: "No comments"
            }));
        }

        const transformedData = transformData(data)
        return transformedData;
    }

    async getPeersAndSocialHistory(seekerId: string): Promise<any> {
        const data = await this.prisma.seekers.findMany({
            where: { id: seekerId },
            include: {
                PeersAndSocialHistory: {
                    select: {
                        relationshipWithPeers: true,
                        friendships: true
                    }
                }
            }
        })

        // Map it as according to how you want it to be rendered on frontend
        interface InterfaceData {
            relationshipWithPeers: string
            relationshipWithFriendships: string
            yourComments: string
        }

        // Transform the data to be sent to frontend
        function transformData(sourceArray: any): InterfaceData[] {
            return sourceArray.map(item => ({
                relationshipWithPeers: item.PeersAndSocialHistory.relationshipWithPeers,
                relationshipWithFriendships: item.PeersAndSocialHistory.relationshipWithFriendships,
                yourComments: "No comments"
            }));
        }

        const transformedData = transformData(data)
        return transformedData;
    }

    async getWorkCareer(seekerId: string): Promise<any> {
        const data = await this.prisma.seekers.findMany({
            where: { id: seekerId },
            include: {
                WorkAndCareer: {
                    select: {
                        natureOfWork: true,
                        sourcesOfStress: true,
                        changesInJob: true,
                        reasonsForChange: true,
                        sourcesOfSupport: true
                    }
                }
            }
        })

        // Map it as according to how you want it to be rendered on frontend
        interface InterfaceData {
            natureOfWork: string
            sourcesOfStress: string
            changesInJob: string
            reasonsForChange: string
            sourcesOfSupport: string
            yourComments: string
        }

        // Transform the data to be sent to frontend
        function transformData(sourceArray: any): InterfaceData[] {
            return sourceArray.map(item => ({
                natureOfWork: item.WorkAndCareer.natureOfWork,
                sourcesOfStress: item.WorkAndCareer.sourcesOfStress,
                changesInJob: item.WorkAndCareer.changesInJob,
                reasonsForChange: item.WorkAndCareer.reasonsForChange,
                sourcesOfSupport: item.WorkAndCareer.sourcesOfSupport,
                yourComments: "No comments"
            }));
        }

        const transformedData = transformData(data)
        return transformedData;
    }

    async getProvisionalDiagnosis(seekerId: string): Promise<any> {
        const data = await this.prisma.seekers.findMany({
            where: { id: seekerId },
            include: {
                ProvisionalDiagnosis: {
                    select: {
                        provisionalDiagnosis: true
                    }
                }
            }
        })

        // Map it as according to how you want it to be rendered on frontend
        interface InterfaceData {
            yourComments: string
        }

        // Transform the data to be sent to frontend
        function transformData(sourceArray: any): InterfaceData[] {
            return sourceArray.map(item => ({
                yourComments: item.ProvisionalDiagnosis.provisionalDiagnosis
            }));
        }

        const transformedData = transformData(data)
        return transformedData;
    }

    async getDifferentialDiagnosis(seekerId: string): Promise<any> {
        const data = await this.prisma.seekers.findMany({
            where: { id: seekerId },
            include: {
                DifferentialDiagnosis: {
                    select: {
                        differentialDiagnosis: true
                    }
                }
            }
        })

        // Map it as according to how you want it to be rendered on frontend
        interface InterfaceData {
            yourComments: string
        }

        // Transform the data to be sent to frontend
        function transformData(sourceArray: any): InterfaceData[] {
            return sourceArray.map(item => ({
                yourComments: item.DifferentialDiagnosis.differentialDiagnosis
            }));
        }

        const transformedData = transformData(data)
        return transformedData;
    }

    async getMentalStatusExamination(seekerId: string): Promise<any> {
        const data = await this.prisma.seekers.findMany({
            where: { id: seekerId },
            include: {
                MentalStatusExamination: {
                    select: {
                        generalAppearance: true,
                        thoughts: true,
                        cognition: true,
                        moodAndAffect: true,
                        attentionAndConcentration: true,
                        levelOfInsight: true,
                        yourComments: true
                    }
                }
            }
        })

        // Map it as according to how you want it to be rendered on frontend
        interface InterfaceData {
            moodAndAffect: string
            attentionAndConcentration: string
            levelOfInsight: string
            yourComments: string
            cognition: string
            generalAppearance: string
            thoughts: string
        }

        // Transform the data to be sent to frontend
        function transformData(sourceArray: any): InterfaceData[] {
            return sourceArray.map(item => ({
                moodAndAffect: item.MentalStatusExamination.moodAndAffect,
                attentionAndConcentration: item.MentalStatusExamination.attentionAndConcentration,
                levelOfInsight: item.MentalStatusExamination.levelOfInsight,
                cognition: item.MentalStatusExamination.cognition,
                generalAppearance: item.MentalStatusExamination.generalAppearance,
                thoughts: item.MentalStatusExamination.thoughts,
                yourComments: item.MentalStatusExamination.yourComments
            }));
        }

        const transformedData = transformData(data)
        return transformedData;
    }

    async getIntakeInformation(seekerId: string): Promise<any> {
        const data = await this.prisma.seekers.findMany({
            where: { id: seekerId },
            include: {
                IntakeInformation: {
                    select: {
                        name: true,
                        keyTherapist: true,
                        statusOfInformedConsent: true,
                        currentFees: true,
                        slidingScale: true,
                        mediumOfTherapy: true,
                        reference: true,
                        intakeClinician: true,
                        psychiatrist: true
                    }
                }
            }
        })

        // Map it as according to how you want it to be rendered on frontend
        interface InterfaceData {
            clientId: string
            name: string
            keyTherapist: string
            informedConsentStatus: string
            currentFees: string
            SlidingScale: string
            mediumOfTherapy: string
            reference: string
            intakeClinician: string
            psychiatrist: string
            yourComments: string
        }

        // Transform the data to be sent to frontend
        function transformData(sourceArray: any): InterfaceData[] {
            return sourceArray.map(item => ({
                clientId: seekerId,
                name: item.IntakeInformation.name,
                keyTherapist: item.IntakeInformation.keyTherapist,
                informedConsentStatus: item.IntakeInformation.statusOfInformedConsent,
                currentFees: item.IntakeInformation.currentFees,
                SlidingScale: item.IntakeInformation.slidingScale,
                mediumOfTherapy: item.IntakeInformation.mediumOfTherapy,
                reference: item.IntakeInformation.reference,
                intakeClinician: item.IntakeInformation.intakeClinician,
                psychiatrist: item.IntakeInformation.psychiatrist,
                yourComments: item.IntakeInformation.yourComments
            }));
        }

        const transformedData = transformData(data)
        return transformedData;
    }


    /*****
     * 
     * Create Functions begin here
     * 
     *****/


    async createPresentingProblem(params: { seekerId: string, seekerData: any }): Promise<any> {
        const createdData = await this.prisma.presentingProblem.create({
            data: {
                seekerId: params.seekerId,
                // Creating related EpisodicDocumentation records
                EpisodicDocumentation: {
                    create:
                    {
                        timestamp: params.seekerData.EpisodicDocumentation.timestamp,
                        verbatim: params.seekerData.EpisodicDocumentation.verbatim,
                        onset: params.seekerData.EpisodicDocumentation.onset,
                        duration: params.seekerData.EpisodicDocumentation.duration,
                        course: params.seekerData.EpisodicDocumentation.course,
                        yourComments: params.seekerData.EpisodicDocumentation.yourComments
                    }
                },

                // Creating related HistoryOfPresentProblem records
                HistoryOfPresentProblem: {
                    create: {
                        timestamp: params.seekerData.HistoryOfPresentProblem.timestamp,
                        keySymptoms: params.seekerData.HistoryOfPresentProblem.keySymptoms,
                        precipitatingFactors: params.seekerData.HistoryOfPresentProblem.precipitatingFactors,
                        predisposingFactors: params.seekerData.HistoryOfPresentProblem.predisposingFactors,
                        perpetuatingFactors: params.seekerData.HistoryOfPresentProblem.perpetuatingFactors,
                        protectiveFactors: params.seekerData.HistoryOfPresentProblem.protectiveFactors,
                        summary: params.seekerData.HistoryOfPresentProblem.summary
                    }
                }
            },
            // Optionally include relations in the response
            include: {
                EpisodicDocumentation: true,
                HistoryOfPresentProblem: true
            }
        });
        return createdData;
    }

    async createBasicDemographicDetails(params: { seekerId: string, seekerData: any }): Promise<any> {
        // Create BasicDemographicDetails record
        const basicDemographicDetails = await this.prisma.basicDemographicDetails.create({
            data: {
                age: params.seekerData.BasicDemographicDetails.age,
                dateOfBirth: params.seekerData.BasicDemographicDetails.dateOfBirth,
                preferredPronoun: params.seekerData.BasicDemographicDetails.preferredPronoun,
                contactNumber: params.seekerData.BasicDemographicDetails.contactNumber,
                email: params.seekerData.BasicDemographicDetails.email,
                currentAddress: params.seekerData.BasicDemographicDetails.currentAddress,
                permanentAddress: params.seekerData.BasicDemographicDetails.permanentAddress,
                caste: params.seekerData.BasicDemographicDetails.caste,
                religion: params.seekerData.BasicDemographicDetails.religion,
                seekerId: params.seekerId
            }
        });

        // Return the created data
        return basicDemographicDetails
    }

    async createEmergencyContact(params: { seekerId: string, seekerData: any }): Promise<any> {
        // Create EmergencyContact record
        const emergencyContact = await this.prisma.emergencyContact.create({
            data: {
                name: params.seekerData.EmergencyContact.name,
                relationship: params.seekerData.EmergencyContact.relationship,
                proximity: params.seekerData.EmergencyContact.proximity,
                contact: params.seekerData.EmergencyContact.contact,
                seekerId: params.seekerId  // Assuming seekerId is the foreign key
            }
        });

        // Return the created emergency contact data
        return emergencyContact;
    }


    async createFamilyHistory(params: { seekerId: string, seekerData: any }): Promise<any> {
        // Create FamilyHistory record
        const familyHistory = await this.prisma.familyHistory.create({
            data: {
                familyStructure: params.seekerData.FamilyHistory.familyStructure,
                sourcesOfStress: params.seekerData.FamilyHistory.sourcesOfStress,
                sourcesOfSupport: params.seekerData.FamilyHistory.sourcesOfSupport,
                mentalHealthHistoryInFamily: params.seekerData.FamilyHistory.mentalHealthHistoryInFamily,
                seekerId: params.seekerId  // Assuming seekerId is the foreign key
            }
        });

        // Return the created FamilyHistory data
        return familyHistory;
    }

    async createSubstanceUsage(params: { seekerId: string, seekerData: any }): Promise<any> {
        // Create Substances record
        const substanceUsage = await this.prisma.substances.create({
            data: {
                introductionToSubstances: params.seekerData.Substances.introductionToSubstances,
                substancesUsed: params.seekerData.Substances.substancesUsed,
                frequency: params.seekerData.Substances.frequency,
                quantity: params.seekerData.Substances.quantity,
                reason: params.seekerData.Substances.reason,
                seekerId: params.seekerId  // Assuming seekerId is the foreign key
            }
        });

        // Return the created substance usage data
        return substanceUsage;
    }

    async createPreMorbidPersonality(params: { seekerId: string, seekerData: any }): Promise<any> {
        // Create PreMorbidPersonality record
        const preMorbidPersonality = await this.prisma.preMorbidPersonality.create({
            data: {
                // Assuming seekerData contains all the necessary fields for PreMorbidPersonality
                opennessToExperience: params.seekerData.PreMorbidPersonality.opennessToExperience,
                conscientiousness: params.seekerData.PreMorbidPersonality.conscientiousness,
                extraversion: params.seekerData.PreMorbidPersonality.extraversion,
                agreeableness: params.seekerData.PreMorbidPersonality.agreeableness,
                neuroticism: params.seekerData.PreMorbidPersonality.neuroticism,
                introversion: params.seekerData.PreMorbidPersonality.introversion,
                noveltySeeking: params.seekerData.PreMorbidPersonality.noveltySeeking,
                impulsiveness: params.seekerData.PreMorbidPersonality.impulsiveness,
                perfectionism: params.seekerData.PreMorbidPersonality.perfectionism,
                humour: params.seekerData.PreMorbidPersonality.humour,
                assertiveness: params.seekerData.PreMorbidPersonality.assertiveness,
                empathy: params.seekerData.PreMorbidPersonality.empathy,
                autonomy: params.seekerData.PreMorbidPersonality.autonomy,
                adaptivity: params.seekerData.PreMorbidPersonality.adaptivity,
                altruism: params.seekerData.PreMorbidPersonality.altruism,
                resilience: params.seekerData.PreMorbidPersonality.resilience,
                patience: params.seekerData.PreMorbidPersonality.patience,
                curiosity: params.seekerData.PreMorbidPersonality.curiosity,
                creativity: params.seekerData.PreMorbidPersonality.creativity,
                defiance: params.seekerData.PreMorbidPersonality.defiance,
                seekerId: params.seekerId  // Assuming seekerId is the foreign key
            }
        });

        // Return the created PreMorbidPersonality data
        return preMorbidPersonality;
    }


    async createSexualHistory(params: { seekerId: string, seekerData: any }): Promise<any> {
        // Create SexualHistory record
        const sexualHistory = await this.prisma.sexualHistory.create({
            data: {
                onsetOfPuberty: params.seekerData.SexualHistory.onsetOfPuberty,
                sexualIdentity: params.seekerData.SexualHistory.sexualIdentity,
                genderIdentity: params.seekerData.SexualHistory.genderIdentity,
                firstSelfExplorationExperience: params.seekerData.SexualHistory.firstSelfExplorationExperience,
                firstSexualExperience: params.seekerData.SexualHistory.firstSexualExperience,
                arousalAndOrgasmicFantasy: params.seekerData.SexualHistory.arousalAndOrgasmicFantasy,
                sexualDiseases: params.seekerData.SexualHistory.sexualDiseases,
                currentSexualFunctioning: params.seekerData.SexualHistory.currentSexualFunctioning,
                sexualAbuse: params.seekerData.SexualHistory.sexualAbuse,
                seekerId: params.seekerId  // Assuming seekerId is the foreign key
            }
        });

        // Return the created SexualHistory data
        return sexualHistory;
    }


    async createPersonalHistory(params: { seekerId: string, seekerData: any }): Promise<any> {
        // Create PersonalHistory record
        const personalHistory = await this.prisma.personalHistory.create({
            data: {
                yourComments: params.seekerData.PersonalHistory.yourComments,
                perinatal: params.seekerData.PersonalHistory.perinatal,
                childhood: params.seekerData.PersonalHistory.childhood,
                adolescent: params.seekerData.PersonalHistory.adolescent,
                adulthood: params.seekerData.PersonalHistory.adulthood,
                oldAge: params.seekerData.PersonalHistory.oldAge,
                seekerId: params.seekerId  // Assuming seekerId is the foreign key
            }
        });

        // Return the created PersonalHistory data
        return personalHistory;
    }


    async createPeersAndSocialHistory(params: { seekerId: string, seekerData: any }): Promise<any> {
        // Create PeersAndSocialHistory record
        const peersAndSocialHistory = await this.prisma.peersAndSocialHistory.create({
            data: {
                relationshipWithPeers: params.seekerData.PeersAndSocialHistory.relationshipWithPeers,
                friendships: params.seekerData.PeersAndSocialHistory.friendships,
                seekerId: params.seekerId  // Assuming seekerId is the foreign key
            }
        });

        // Return the created PeersAndSocialHistory data
        return peersAndSocialHistory;
    }

    async createWorkCareer(params: { seekerId: string, seekerData: any }): Promise<any> {
        // Create WorkAndCareer record
        const workAndCareer = await this.prisma.workAndCareer.create({
            data: {
                natureOfWork: params.seekerData.WorkAndCareer.natureOfWork,
                sourcesOfStress: params.seekerData.WorkAndCareer.sourcesOfStress,
                changesInJob: params.seekerData.WorkAndCareer.changesInJob,
                reasonsForChange: params.seekerData.WorkAndCareer.reasonsForChange,
                sourcesOfSupport: params.seekerData.WorkAndCareer.sourcesOfSupport,
                seekerId: params.seekerId  // Assuming seekerId is the foreign key
            }
        });

        // Return the created WorkAndCareer data
        return workAndCareer;
    }

    async createProvisionalDiagnosis(params: { seekerId: string, seekerData: any }): Promise<any> {
        // Create ProvisionalDiagnosis record
        const provisionalDiagnosis = await this.prisma.provisionalDiagnosis.create({
            data: {
                provisionalDiagnosis: params.seekerData.ProvisionalDiagnosis.provisionalDiagnosis,
                seekerId: params.seekerId  // Assuming seekerId is the foreign key
            }
        });

        // Return the created ProvisionalDiagnosis data
        return provisionalDiagnosis;
    }


    async createDifferentialDiagnosis(params: { seekerId: string, seekerData: any }): Promise<any> {
        // Create DifferentialDiagnosis record
        const differentialDiagnosis = await this.prisma.differentialDiagnosis.create({
            data: {
                differentialDiagnosis: params.seekerData.DifferentialDiagnosis.differentialDiagnosis,
                seekerId: params.seekerId  // Assuming seekerId is the foreign key
            }
        });

        // Return the created DifferentialDiagnosis data
        return differentialDiagnosis;
    }


    async createMentalStatusExamination(params: { seekerId: string, seekerData: any }): Promise<any> {
        // Create MentalStatusExamination record
        const mentalStatusExamination = await this.prisma.mentalStatusExamination.create({
            data: {
                moodAndAffect: params.seekerData.MentalStatusExamination.moodAndAffect,
                attentionAndConcentration: params.seekerData.MentalStatusExamination.attentionAndConcentration,
                levelOfInsight: params.seekerData.MentalStatusExamination.levelOfInsight,
                yourComments: params.seekerData.MentalStatusExamination.yourComments,
                seekerId: params.seekerId  // Assuming seekerId is the foreign key
            }
        });
        // Return the created MentalStatusExamination data
        return mentalStatusExamination;
    }


    async createIntakeInformation(params: { seekerId: string, seekerData: any }): Promise<any> {
        // Create IntakeInformation record
        const intakeInformation = await this.prisma.intakeInformation.create({
            data: {
                name: params.seekerData.IntakeInformation.name,
                keyTherapist: params.seekerData.IntakeInformation.keyTherapist,
                statusOfInformedConsent: params.seekerData.IntakeInformation.statusOfInformedConsent,
                currentFees: params.seekerData.IntakeInformation.currentFees,
                slidingScale: params.seekerData.IntakeInformation.slidingScale,
                mediumOfTherapy: params.seekerData.IntakeInformation.mediumOfTherapy,
                reference: params.seekerData.IntakeInformation.reference,
                intakeClinician: params.seekerData.IntakeInformation.intakeClinician,
                psychiatrist: params.seekerData.IntakeInformation.psychiatrist,
                seekerId: params.seekerId
            }
        });

        // Return the created IntakeInformation data
        return intakeInformation;
    }



    /*****
     * 
     * update functions begins here
     * 
     *****/


    async updatePresentingProblem(params: { seekerId: string, seekerData: any }): Promise<any> {
        const transformedUpdatedData = {
            EpisodicDocumentation: {
                verbatim: params.seekerData?.clientWords ?? null,
                onset: params.seekerData?.onset ?? null,
                duration: params.seekerData?.duration ?? null,
                yourComments: params.seekerData?.yourComments ?? null
            },
            HistoryOfPresentProblem: {
                timestamp: new Date().toISOString(), // Replace with actual timestamp if available
                keySymptoms: params.seekerData?.keySymptoms ?? null,
                precipitatingFactors: params.seekerData?.precipitatingFactors ?? null,
                predisposingFactors: params.seekerData?.predisposingFactors ?? null,
                perpetuatingFactors: params.seekerData?.perpetuatingFactors ?? null,
                protectiveFactors: params.seekerData?.protectiveFactors ?? null,
                summary: params.seekerData?.summary ?? null
            }
        };

        const updatedPresentingProblem = await this.prisma.seekers.update({
            where: { id: params.seekerId },
            data: {
                PresentingProblem: {
                    update: {
                        EpisodicDocumentation: {
                            update: {
                                data: transformedUpdatedData.EpisodicDocumentation
                            }
                        },
                        HistoryOfPresentProblem: {
                            update: {
                                data: transformedUpdatedData.HistoryOfPresentProblem
                            }
                        }
                    }
                }
            },
            include: {
                PresentingProblem: {
                    include: {
                        EpisodicDocumentation: true,
                        HistoryOfPresentProblem: true
                    }
                }
            }
        })
        return updatedPresentingProblem;
    }

    async updateBasicBasicDemographicDetails(params: { seekerId: string, seekerData: any }): Promise<any> {
        const transformedUpdatedData = {
            IntakeInformation: {
                name: params.seekerData?.name ?? null
            },
            BasicDemographicDetails: {
                age: Number(params.seekerData?.age) ?? null,
                dateOfBirth: new Date(params.seekerData?.dob).toISOString() ?? null,
                preferredPronoun: params.seekerData?.preferredPronoun ?? null,
                contactNumber: params.seekerData?.contactNum ?? null,
                email: params.seekerData?.email ?? null,
                currentAddress: params.seekerData?.currentAddress ?? null,
                permanentAddress: params.seekerData?.permanentAddress ?? null,
                caste: params.seekerData?.caste ?? null,
                religion: params.seekerData?.religion ?? null
            },
            FamilyHistory: {
                familyStructure: params.seekerData?.familyType ?? null,
            }
        };

        const updatedBasicDemographicDetails = await this.prisma.seekers.update({
            where: { id: params.seekerId },
            data: {
                IntakeInformation: {
                    update: {
                        data: transformedUpdatedData.IntakeInformation
                    }
                },
                BasicDemographicDetails: {
                    update: {
                        data: transformedUpdatedData.BasicDemographicDetails
                    }
                },
                FamilyHistory: {
                    update: {
                        data: transformedUpdatedData.FamilyHistory
                    }
                }
            },
            include: {
                IntakeInformation: true,
                BasicDemographicDetails: true,
                FamilyHistory: true
            }
        });

        return updatedBasicDemographicDetails;
    }

    async updateEmergencyContact(params: { seekerId: string, seekerData: any }): Promise<any> {
        const transformedUpdatedData = {
            EmergencyContact: {
                name: params.seekerData?.name ?? null,
                relationship: params.seekerData?.relationship ?? null,
                proximity: params.seekerData?.proximity ?? null,
                contact: params.seekerData?.contactInfo ?? null
            }
        };

        const updatedEmergencyContact = await this.prisma.seekers.update({
            where: { id: params.seekerId },
            data: {
                EmergencyContact: {
                    update: {
                        data: transformedUpdatedData.EmergencyContact
                    }
                }
            },
            include: {
                EmergencyContact: true,
            }
        });

        return updatedEmergencyContact;
    }

    async updateFamilyHistory(params: { seekerId: string, seekerData: any }): Promise<any> {
        const transformedUpdatedData = {
            FamilyHistory: {
                familyStructure: params.seekerData?.familyStructure ?? null,
                sourcesOfStress: params.seekerData?.sourcesOfStress ?? null,
                sourcesOfSupport: params.seekerData?.sourcesOfSupport ?? null,
                mentalHealthHistoryInFamily: params.seekerData?.mentalHealthHistoryInFamily ?? null
            }
        };

        const updatedFamilyHistory = await this.prisma.seekers.update({
            where: { id: params.seekerId },
            data: {
                FamilyHistory: {
                    update: {
                        data: transformedUpdatedData.FamilyHistory
                    }
                }
            },
            include: {
                FamilyHistory: true,
            }
        });

        return updatedFamilyHistory;
    }

    async updateSubstanceUsage(params: { seekerId: string, seekerData: any }): Promise<any> {
        const transformedUpdatedData = {
            Substances: {
                introductionToSubstances: params.seekerData.introductionToSubstance ?? null,
                substancesUsed: params.seekerData?.substanceUsed ?? null,
                frequency: params.seekerData?.frequency ?? null,
                quantity: params.seekerData?.quantity ?? null,
                reason: params.seekerData?.reason ?? null
            }
        };

        const updatedSubstances = await this.prisma.seekers.update({
            where: { id: params.seekerId },
            data: {
                Substances: {
                    update: {
                        data: transformedUpdatedData.Substances
                    }
                }
            },
            include: {
                Substances: true,
            }
        });

        return updatedSubstances;
    }

    async updatePreMorbidPersonality(params: { seekerId: string, seekerData: any }): Promise<any> {
        const transformedUpdatedData = {
            PreMorbidPersonality: {
                opennessToExperience: params.seekerData?.opennessToExpression ?? null,
                conscientiousness: params.seekerData?.conscientiousness ?? null,
                extraversion: params.seekerData?.extraversion ?? null,
                agreeableness: params.seekerData?.agreeableness ?? null,
                neuroticism: params.seekerData?.neuroticism ?? null,
                introversion: params.seekerData?.introversion ?? null,
                noveltySeeking: params.seekerData?.noveltySeeking ?? null,
                impulsiveness: params.seekerData?.impulsiveness ?? null,
                perfectionism: params.seekerData?.perfectionism ?? null,
                humour: params.seekerData?.humour ?? null,
                assertiveness: params.seekerData?.assertiveness ?? null,
                empathy: params.seekerData?.empathy ?? null,
                autonomy: params.seekerData?.autonomy ?? null,
                adaptivity: params.seekerData?.adaptivity ?? null,
                altruism: params.seekerData?.altruism ?? null,
                resilience: params.seekerData?.resilience ?? null,
                patience: params.seekerData?.patience ?? null,
                curiosity: params.seekerData?.curiosity ?? null,
                creativity: params.seekerData?.creativity ?? null,
                defiance: params.seekerData?.defiance ?? null,
            }
        };

        const updatedPreMorbidPersonality = await this.prisma.seekers.update({
            where: { id: params.seekerId },
            data: {
                PreMorbidPersonality: {
                    update: {
                        data: transformedUpdatedData.PreMorbidPersonality
                    }
                }
            },
            include: {
                PreMorbidPersonality: true,
            }
        });

        return updatedPreMorbidPersonality;
    }

    async updateSexualHistory(params: { seekerId: string, seekerData: any }): Promise<any> {
        const transformedUpdatedData = {
            SexualHistory: {
                onsetOfPuberty: params.seekerData?.onsetOfPuberty ?? null,
                genderIdentity: params.seekerData?.genderIdentity ?? null,
                arousalAndOrgasmicFantasy: params.seekerData?.fantasy ?? null,
                firstSexualExperience: params.seekerData?.firstSexualExperience ?? null,
                sexualIdentity: params.seekerData?.sexualIdentity ?? null,
                firstSelfExplorationExperience: params.seekerData?.firstSelfExploration ?? null,
                currentSexualFunctioning: params.seekerData?.overallSexualFunctioning ?? null,
                sexualDiseases: params.seekerData?.sexualDiseases ?? null,
                sexualAbuse: params.seekerData?.sexualAbuse ?? null
            }
        };

        const updatedSexualHistory = await this.prisma.seekers.update({
            where: { id: params.seekerId },
            data: {
                SexualHistory: {
                    update: {
                        data: transformedUpdatedData.SexualHistory
                    }
                }
            },
            include: {
                SexualHistory: true,
            }
        });

        return updatedSexualHistory;
    }

    async updatePersonalHistory(params: { seekerId: string, seekerData: any }): Promise<any> {
        const transformedUpdatedData = {
            PersonalHistory: {
                perinatal: params.seekerData?.perinatal ?? null,
                childhood: params.seekerData?.childhood ?? null,
                adolescent: params.seekerData?.adolescent ?? null,
                adulthood: params.seekerData?.adulthood ?? null,
                oldAge: params.seekerData?.oldAge ?? null
            }
        };

        // Updating the PersonalHistory in the database
        const updatedPersonalHistory = await this.prisma.seekers.update({
            where: { id: params.seekerId },
            data: {
                PersonalHistory: {
                    update: {
                        data: transformedUpdatedData.PersonalHistory
                    }
                }
            },
            include: {
                PersonalHistory: true,
            }
        });

        return updatedPersonalHistory;
    }

    async updatePeersAndSocialHistory(params: { seekerId: string, seekerData: any }): Promise<any> {
        // Transforming the incoming seekerData into the format expected by Prisma
        const transformedUpdatedData = {
            PeersAndSocialHistory: {
                relationshipWithPeers: params.seekerData?.relationshipWithPeers ?? null,
                friendships: params.seekerData?.friendships ?? null
            }
        };

        // Updating the PeersAndSocialHistory in the database
        const updatedPeersAndSocialHistory = await this.prisma.seekers.update({
            where: { id: params.seekerId },
            data: {
                PeersAndSocialHistory: {
                    update: {
                        data: transformedUpdatedData.PeersAndSocialHistory
                    }
                }
            },
            include: {
                PeersAndSocialHistory: true,
            }
        });

        return updatedPeersAndSocialHistory;
    }


    async updateWorkCareer(params: { seekerId: string, seekerData: any }): Promise<any> {
        // Transforming the incoming seekerData into the format expected by Prisma
        const transformedUpdatedData = {
            WorkAndCareer: {
                natureOfWork: params.seekerData?.natureOfWork ?? null,
                sourcesOfStress: params.seekerData?.sourcesOfStress ?? null,
                changesInJob: params.seekerData?.changesInJob ?? null,
                reasonsForChange: params.seekerData?.reasonsForChange ?? null,
                sourcesOfSupport: params.seekerData?.sourcesOfSupport ?? null
            }
        };

        // Updating the WorkAndCareer in the database
        const updatedWorkAndCareer = await this.prisma.seekers.update({
            where: { id: params.seekerId },
            data: {
                WorkAndCareer: {
                    update: {
                        data: transformedUpdatedData.WorkAndCareer
                    }
                }
            },
            include: {
                WorkAndCareer: true,
            }
        });

        return updatedWorkAndCareer;
    }


    async updateProvisionalDiagnosis(params: { seekerId: string, seekerData: any }): Promise<any> {
        // Transforming the incoming seekerData into the format expected by Prisma
        const transformedUpdatedData = {
            ProvisionalDiagnosis: {
                provisionalDiagnosis: params.seekerData?.yourComments ?? null
            }
        };

        // Updating the ProvisionalDiagnosis in the database
        const updatedProvisionalDiagnosis = await this.prisma.seekers.update({
            where: { id: params.seekerId },
            data: {
                ProvisionalDiagnosis: {
                    update: {
                        data: transformedUpdatedData.ProvisionalDiagnosis
                    }
                }
            },
            include: {
                ProvisionalDiagnosis: true,
            }
        });

        return updatedProvisionalDiagnosis;
    }


    async updateDifferentialDiagnosis(params: { seekerId: string, seekerData: any }): Promise<any> {
        // Transforming the incoming seekerData into the format expected by Prisma
        const transformedUpdatedData = {
            DifferentialDiagnosis: {
                differentialDiagnosis: params.seekerData?.yourComments ?? null
            }
        };

        // Updating the DifferentialDiagnosis in the database
        const updatedDifferentialDiagnosis = await this.prisma.seekers.update({
            where: { id: params.seekerId },
            data: {
                DifferentialDiagnosis: {
                    update: {
                        data: transformedUpdatedData.DifferentialDiagnosis
                    }
                }
            },
            include: {
                DifferentialDiagnosis: true,
            }
        });

        return updatedDifferentialDiagnosis;
    }


    async updateMentalStatusExamination(params: { seekerId: string, seekerData: any }): Promise<any> {
        // Transforming the incoming seekerData into the format expected by Prisma
        const transformedUpdatedData = {
            MentalStatusExamination: {
                moodAndAffect: params.seekerData?.moodAndAffect ?? null,
                attentionAndConcentration: params.seekerData?.attentionAndConcentration ?? null,
                levelOfInsight: params.seekerData?.levelOfInsight ?? null,
                cognition: params.seekerData?.cognition ?? null,
                generalAppearance: params.seekerData?.generalAppearance ?? null,
                thoughts: params.seekerData?.thoughts ?? null,
                yourComments: params.seekerData?.yourComments ?? null
            }
        };

        // Updating the MentalStatusExamination in the database
        const updatedMentalStatusExamination = await this.prisma.seekers.update({
            where: { id: params.seekerId },
            data: {
                MentalStatusExamination: {
                    update: {
                        data: transformedUpdatedData?.MentalStatusExamination ?? null
                    }
                }
            },
            include: {
                MentalStatusExamination: true,
            }
        });

        return updatedMentalStatusExamination;
    }

    async updateIntakeInformation(params: { seekerId: string, seekerData: any }): Promise<any> {
        // Transforming the incoming seekerData into the format expected by Prisma
        const transformedUpdatedData = {
            IntakeInformation: {
                name: params.seekerData?.name ?? null,
                keyTherapist: params.seekerData?.keyTherapist ?? null,
                statusOfInformedConsent: params.seekerData?.informedConsentStatus ?? null,
                currentFees: params.seekerData?.currentFees ?? null,
                slidingScale: params.seekerData?.SlidingScale ?? null,
                mediumOfTherapy: params.seekerData?.mediumOfTherapy ?? null,
                reference: params.seekerData?.reference ?? null,
                intakeClinician: params.seekerData?.intakeClinician ?? null,
                psychiatrist: params.seekerData?.psychiatrist ?? null,
                // yourComments: params.seekerData.yourComments
            }
        };

        // Updating the IntakeInformation in the database
        const updatedIntakeInformation = await this.prisma.seekers.update({
            where: { id: params.seekerId },
            data: {
                IntakeInformation: {
                    update: {
                        data: transformedUpdatedData.IntakeInformation
                    }
                }
            },
            include: {
                IntakeInformation: true,
            }
        });

        return updatedIntakeInformation;
    }
}

