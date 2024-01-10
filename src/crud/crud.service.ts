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
            pid: number
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
                    pid: parseInt(item.id), // assuming id is convertible to number
                    patientName: `Patient ${index + 1}`, // Placeholder, as the real name is not in the source
                    sessionsDone: item.SeekerAttributes.numberOfSessionsDone,
                    nextSessionScheduled: item.SeekerAttributes.nextSessionScheduled === 1,
                    fees: 100, // Placeholder value
                    preferredDayAndTime: item.SeekerAttributes.preferredDayAndTime,
                    therapist: item.therapistId,
                    contactNo: '123-456-7890', // Placeholder value
                    problemType: item.SeekerAttributes.problemType,
                    lastSessionPaymentDone: item.SeekerAttributes.lastSessionPaymentDone === 1,
                    isActive: item.SeekerAttributes.isActive === 'Yes'
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
                name: item.IntakeInformation.name,
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

    async createNewSeeker(data: { therapistId: string, seekerData: any }): Promise<any> {
        return this.prisma.seekers.create({
            data: {
                therapist: {
                    connect: { id: data.therapistId },
                },
                // Add Seeker data
                referredBy: data.seekerData.referredBy,
                referralSourcePlatform: data.seekerData.referralSourcePlatform,
                initialCommentsByTherapist: data.seekerData.initialCommentsByTherapist,
                location: data.seekerData.location,
                // ... other seeker fields
                SeekerAttributes: {
                    create: data.seekerData.seekerAttributes, // Object with seekerAttributes fields
                },
                IntakeInformation: {
                    create: data.seekerData.intakeInformation, // Object with intakeInformation fields
                },
                BasicDemographicDetails: {
                    create: data.seekerData.basicDemographicDetails, // Object with basicDemographicDetails fields
                },
            },
        });
    }

    async updateExistingSeeker(data: { seekerId: string, updatedSeekerData: any }): Promise<any> {
        return this.prisma.intakeInformation.upsert({
            where: {
                seekerId: data.seekerId, // Unique identifier for SeekerAttributes
            },
            update: data.updatedSeekerData,
            create: {
                ...data.updatedSeekerData,
                seeker: {
                    connect: {
                        id: data.seekerId
                    }
                }
            }
        });
    }

    async getPresentingProblem(seekerId: string): Promise<any> {
        console.log('get presenting problem service')
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

    async getBasicInformation(seekerId: string): Promise<any> {
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
                name: item.IntakeInformation.name,
                age: item.BasicDemographicDetails.age,
                dob: item.BasicDemographicDetails.dateOfBirth,
                preferredPronoun: item.BasicDemographicDetails.preferredPronoun,
                contactNum: item.BasicDemographicDetails.contactNumber,
                email: item.BasicDemographicDetails.email,
                currentAddress: item.BasicDemographicDetails.currentAddress,
                permanentAddress: item.BasicDemographicDetails.permanentAddress,
                caste: item.BasicDemographicDetails.caste,
                religion: item.BasicDemographicDetails.religion,
                familyType: item.FamilyHistory.familyStructure,
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
                name: item.IntakeInformation.name,
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
            "Openness to Expression": string,
            Conscientiousness: string,
            Extraversion: string,
            Agreeableness: string,
            Neuroticism: string,
            Introversion: string,
            Patience: string,
            Curiosity: string,
            Creativity: string,
            Defiance: string,
            "Novelty Seeking": string,
            Impulsiveness: string,
            Perfectionism: string,
            Humour: string,
            Assertiveness: string,
            Empathy: string,
            Autonomy: string,
            Adaptivity: string,
            Altruism: string,
            Resilience: string,
            Comments: string
        }

        // Transform the data to be sent to frontend
        function transformData(sourceArray: any): InterfaceData[] {
            return sourceArray.map(item => ({
                "Openness to Expression": item.PreMorbidPersonality.opennessToExperience,
                Conscientiousness: item.PreMorbidPersonality.conscientiousness,
                Extraversion: item.PreMorbidPersonality.extraversion,
                Agreeableness: item.PreMorbidPersonality.agreeableness,
                Neuroticism: item.PreMorbidPersonality.neuroticism,
                Introversion: item.PreMorbidPersonality.introversion,
                Patience: item.PreMorbidPersonality.patience,
                Curiosity: item.PreMorbidPersonality.curiosity,
                Creativity: item.PreMorbidPersonality.creativity,
                Defiance: item.PreMorbidPersonality.defiance,
                "Novelty Seeking": item.PreMorbidPersonality.noveltySeeking,
                Impulsiveness: item.PreMorbidPersonality.impulsiveness,
                Perfectionism: item.PreMorbidPersonality.perfectionism,
                Humour: item.PreMorbidPersonality.humour,
                Assertiveness: item.PreMorbidPersonality.assertiveness,
                Empathy: item.PreMorbidPersonality.empathy,
                Autonomy: item.PreMorbidPersonality.autonomy,
                Adaptivity: item.PreMorbidPersonality.adaptivity,
                Altruism: item.PreMorbidPersonality.altruism,
                Resilience: item.PreMorbidPersonality.resilience,
                Comments: "No comments"
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
                        moodAndEffect: true,
                        attentionAndConcentration: true,
                        levelOfInsight: true,
                        yourComments: true
                    }
                }
            }
        })

        // Map it as according to how you want it to be rendered on frontend
        interface InterfaceData {
            moodAndEffect: string
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
                moodAndEffect: item.MentalStatusExamination.moodAndEffect,
                attentionAndConcentration: item.MentalStatusExamination.attentionAndConcentration,
                levelOfInsight: item.MentalStatusExamination.levelOfInsight,
                cognition: "cognition",
                generalAppearance: "general appearance",
                thoughts: "thoughts",
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
                yourComments: item.MentalStatusExamination.yourComments
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

    async createBasicInformation(params: { seekerId: string, seekerData: any }): Promise<any> {
        // Create IntakeInformation record
        const intakeInfo = await this.prisma.intakeInformation.create({
            data: {
                ...params.seekerData.IntakeInformation,
                seekerId: params.seekerId
            }
        });

        // Create BasicDemographicDetails record
        const demographicDetails = await this.prisma.basicDemographicDetails.create({
            data: {
                ...params.seekerData.BasicDemographicDetails,
                seekerId: params.seekerId
            }
        });

        // Create FamilyHistory record
        const familyHistory = await this.prisma.familyHistory.create({
            data: {
                ...params.seekerData.FamilyHistory,
                seekerId: params.seekerId
            }
        });

        // Return the created data
        return {
            IntakeInformation: intakeInfo,
            BasicDemographicDetails: demographicDetails,
            FamilyHistory: familyHistory
        };
    }

    async createEmergencyContact(params: { seekerId: string, seekerData: any }): Promise<any> {
        // Create EmergencyContact record
        const emergencyContact = await this.prisma.emergencyContact.create({
            data: {
                name: params.seekerData.name,
                relationship: params.seekerData.relationship,
                proximity: params.seekerData.proximity,
                contact: params.seekerData.contact,
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
                familyStructure: params.seekerData.familyStructure,
                sourcesOfStress: params.seekerData.sourcesOfStress,
                sourcesOfSupport: params.seekerData.sourcesOfSupport,
                mentalHealthHistoryInFamily: params.seekerData.mentalHealthHistoryInFamily,
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
                introductionToSubstances: params.seekerData.introductionToSubstances,
                substancesUsed: params.seekerData.substancesUsed,
                frequency: params.seekerData.frequency,
                quantity: params.seekerData.quantity,
                reason: params.seekerData.reason,
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
                ...params.seekerData.PreMorbidPersonality,
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
                onsetOfPuberty: params.seekerData.onsetOfPuberty,
                sexualIdentity: params.seekerData.sexualIdentity,
                genderIdentity: params.seekerData.genderIdentity,
                firstSelfExplorationExperience: params.seekerData.firstSelfExplorationExperience,
                firstSexualExperience: params.seekerData.firstSexualExperience,
                arousalAndOrgasmicFantasy: params.seekerData.arousalAndOrgasmicFantasy,
                sexualDiseases: params.seekerData.sexualDiseases,
                currentSexualFunctioning: params.seekerData.currentSexualFunctioning,
                sexualAbuse: params.seekerData.sexualAbuse,
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
                yourComments: params.seekerData.yourComments,
                perinatal: params.seekerData.perinatal,
                childhood: params.seekerData.childhood,
                adolescent: params.seekerData.adolescent,
                adulthood: params.seekerData.adulthood,
                oldAge: params.seekerData.oldAge,
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
                relationshipWithPeers: params.seekerData.relationshipWithPeers,
                friendships: params.seekerData.friendships,
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
                natureOfWork: params.seekerData.natureOfWork,
                sourcesOfStress: params.seekerData.sourcesOfStress,
                changesInJob: params.seekerData.changesInJob,
                reasonsForChange: params.seekerData.reasonsForChange,
                sourcesOfSupport: params.seekerData.sourcesOfSupport,
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
                provisionalDiagnosis: params.seekerData.provisionalDiagnosis,
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
                differentialDiagnosis: params.seekerData.differentialDiagnosis,
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
                moodAndEffect: params.seekerData.moodAndEffect,
                attentionAndConcentration: params.seekerData.attentionAndConcentration,
                levelOfInsight: params.seekerData.levelOfInsight,
                yourComments: params.seekerData.yourComments,
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
                name: params.seekerData.name,
                keyTherapist: params.seekerData.keyTherapist,
                statusOfInformedConsent: params.seekerData.statusOfInformedConsent,
                currentFees: params.seekerData.currentFees,
                slidingScale: params.seekerData.slidingScale,
                mediumOfTherapy: params.seekerData.mediumOfTherapy,
                reference: params.seekerData.reference,
                intakeClinician: params.seekerData.intakeClinician,
                psychiatrist: params.seekerData.psychiatrist,
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
        // console.log('Raw seeker data')
        // console.log(params.seekerData)
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
                // summary: params.seekerData?.summary ?? null
            }
        };

        // console.log('Transformed seeker data')
        // console.log(transformedUpdatedData)
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
        });

        // console.log('Updated seeker data')
        // console.log(updatedPresentingProblem)
        return updatedPresentingProblem;
    }

    async updateBasicInformation(params: { seekerId: string, seekerData: any }): Promise<any> {
        const transformedUpdatedData = {
            IntakeInformation: {
                name: params.seekerData.name
            },
            BasicDemographicDetails: {
                age: params.seekerData.age,
                dateOfBirth: params.seekerData.dob,
                preferredPronoun: params.seekerData.preferredPronoun,
                contactNumber: params.seekerData.contactNum,
                email: params.seekerData.email,
                currentAddress: params.seekerData.currentAddress,
                permanentAddress: params.seekerData.permanentAddress,
                caste: params.seekerData.caste,
                religion: params.seekerData.religion
            },
            FamilyHistory: {
                familyStructure: params.seekerData.familyStructure,
            }
        };

        const updatedBasicInformation = await this.prisma.seekers.update({
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

        return updatedBasicInformation;
    }

    async updateEmergencyContact(params: { seekerId: string, seekerData: any }): Promise<any> {
        const transformedUpdatedData = {
            EmergencyContact: {
                name: params.seekerData.name,
                relationship: params.seekerData.relationship,
                proximity: params.seekerData.proximity,
                contact: params.seekerData.contactInfo
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
                familyStructure: params.seekerData.familyStructure,
                sourcesOfStress: params.seekerData.sourcesOfStress,
                sourcesOfSupport: params.seekerData.sourcesOfSupport,
                mentalHealthHistoryInFamily: params.seekerData.mentalHealthHistoryInFamily
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
                introductionToSubstances: params.seekerData.introductionToSubstance,
                substancesUsed: params.seekerData.substanceUsed,
                frequency: params.seekerData.frequency,
                quantity: params.seekerData.quantity,
                reason: params.seekerData.reason
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
                opennessToExperience: params.seekerData["Openness to Expression"],
                conscientiousness: params.seekerData.Conscientiousness,
                extraversion: params.seekerData.Extraversion,
                agreeableness: params.seekerData.Agreeableness,
                neuroticism: params.seekerData.Neuroticism,
                introversion: params.seekerData.Introversion,
                noveltySeeking: params.seekerData["Novelty Seeking"],
                impulsiveness: params.seekerData.Impulsiveness,
                perfectionism: params.seekerData.Perfectionism,
                humour: params.seekerData.Humour,
                assertiveness: params.seekerData.Assertiveness,
                empathy: params.seekerData.Empathy,
                autonomy: params.seekerData.Autonomy,
                adaptivity: params.seekerData.Adaptivity,
                altruism: params.seekerData.Altruism,
                resilience: params.seekerData.Resilience,
                patience: params.seekerData.Patience,
                curiosity: params.seekerData.Curiosity,
                creativity: params.seekerData.Creativity,
                defiance: params.seekerData.Defiance,
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
                onsetOfPuberty: params.seekerData.onsetOfPuberty,
                genderIdentity: params.seekerData.genderIdentity,
                arousalAndOrgasmicFantasy: params.seekerData.fantasy,
                firstSexualExperience: params.seekerData.firstSexualExperience,
                sexualIdentity: params.seekerData.sexualIdentity,
                firstSelfExplorationExperience: params.seekerData.firstSelfExploration,
                currentSexualFunctioning: params.seekerData.overallSexualFunctioning,
                sexualDiseases: params.seekerData.sexualDiseases,
                sexualAbuse: params.seekerData.sexualAbuse
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
                perinatal: params.seekerData.perinatal,
                childhood: params.seekerData.childhood,
                adolescent: params.seekerData.adolescent,
                adulthood: params.seekerData.adulthood,
                oldAge: params.seekerData.oldAge
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
                relationshipWithPeers: params.seekerData.relationshipWithPeers,
                relationshipWithFriendships: params.seekerData.friendships
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
                natureOfWork: params.seekerData.natureOfWork,
                sourcesOfStress: params.seekerData.sourcesOfStress,
                changesInJob: params.seekerData.changesInJob,
                reasonsForChange: params.seekerData.reasonsForChange,
                sourcesOfSupport: params.seekerData.sourcesOfSupport
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
                provisionalDiagnosis: params.seekerData.yourComments
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
                differentialDiagnosis: params.seekerData.yourComments
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
                moodAndEffect: params.seekerData.moodAndEffect,
                attentionAndConcentration: params.seekerData.attentionAndConcentration,
                levelOfInsight: params.seekerData.levelOfInsight,
                yourComments: params.seekerData.yourComments,
                // Add any other fields that are required for update
                // cognition: params.seekerData.cognition,
                // generalAppearance: params.seekerData.generalAppearance,
                // thoughts: params.seekerData.thoughts
            }
        };

        // Updating the MentalStatusExamination in the database
        const updatedMentalStatusExamination = await this.prisma.seekers.update({
            where: { id: params.seekerId },
            data: {
                MentalStatusExamination: {
                    update: {
                        data: transformedUpdatedData.MentalStatusExamination
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
                name: params.seekerData.name,
                keyTherapist: params.seekerData.keyTherapist,
                statusOfInformedConsent: params.seekerData.informedConsentStatus,
                currentFees: params.seekerData.currentFees,
                slidingScale: params.seekerData.SlidingScale,
                mediumOfTherapy: params.seekerData.mediumOfTherapy,
                reference: params.seekerData.reference,
                intakeClinician: params.seekerData.intakeClinician,
                psychiatrist: params.seekerData.psychiatrist,
                yourComments: params.seekerData.yourComments
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

