-- CreateTable
CREATE TABLE `Therapists` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `referredBy` VARCHAR(191) NULL,
    `clerkUserId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `referralSourcePlatform` ENUM('Facebook', 'Whatsapp', 'Twitter', 'Discord') NULL,
    `yearsOfExperience` ENUM('OneToThree', 'FourToSix', 'SevenToTen', 'MoreThanTen') NULL,
    `location` VARCHAR(191) NULL,
    `role` ENUM('Clinical', 'Associate') NULL,

    UNIQUE INDEX `Therapists_email_key`(`email`),
    UNIQUE INDEX `Therapists_phone_key`(`phone`),
    UNIQUE INDEX `Therapists_clerkUserId_key`(`clerkUserId`),
    INDEX `Therapists_clerkUserId_idx`(`clerkUserId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Seekers` (
    `id` VARCHAR(191) NOT NULL,
    `referredBy` VARCHAR(191) NULL,
    `referralSourcePlatform` ENUM('Facebook', 'Whatsapp', 'Twitter', 'Discord') NULL,
    `initialCommentsByTherapist` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NULL,
    `therapistId` VARCHAR(191) NULL,

    INDEX `Seekers_therapistId_idx`(`therapistId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SeekerAttributes` (
    `id` VARCHAR(191) NOT NULL,
    `cohortType` ENUM('Active', 'WasActive', 'Waitlist') NULL,
    `stage` VARCHAR(191) NULL,
    `numberOfSessionsDone` INTEGER NULL,
    `nextSessionScheduled` INTEGER NULL,
    `preferredDayAndTime` DATETIME(3) NULL,
    `modeOfSession` ENUM('Online', 'Offline') NULL,
    `lastSessionPaymentDone` INTEGER NULL,
    `problemType` ENUM('Anxiety', 'Stress', 'RelationshipIssues') NULL,
    `isActive` ENUM('Yes', 'No') NULL,
    `seekerId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `SeekerAttributes_seekerId_key`(`seekerId`),
    INDEX `SeekerAttributes_seekerId_idx`(`seekerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CalenderEvents` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `label` VARCHAR(191) NOT NULL,
    `startTimestamp` DATETIME(3) NOT NULL,
    `endTimestamp` DATETIME(3) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `therapistId` VARCHAR(191) NOT NULL,

    INDEX `CalenderEvents_therapistId_idx`(`therapistId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TherapySessions` (
    `id` VARCHAR(191) NOT NULL,
    `startTimestamp` DATETIME(3) NOT NULL,
    `endTimestamp` DATETIME(3) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `therapistId` VARCHAR(191) NOT NULL,
    `seekerId` VARCHAR(191) NOT NULL,

    INDEX `TherapySessions_therapistId_idx`(`therapistId`),
    INDEX `TherapySessions_seekerId_idx`(`seekerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SeekerProgress` (
    `id` VARCHAR(191) NOT NULL,
    `progressSubject` VARCHAR(191) NOT NULL,
    `progressBody` VARCHAR(191) NOT NULL,
    `progressReflections` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `seekerId` VARCHAR(191) NOT NULL,

    INDEX `SeekerProgress_seekerId_idx`(`seekerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SeekerProgressComments` (
    `id` VARCHAR(191) NOT NULL,
    `subComment` VARCHAR(191) NOT NULL,
    `seekerProgressId` VARCHAR(191) NOT NULL,

    INDEX `SeekerProgressComments_seekerProgressId_idx`(`seekerProgressId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `IntakeInformation` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `statusOfInformedConsent` VARCHAR(191) NULL,
    `timestampOfIntake` DATETIME(3) NULL,
    `currentFees` VARCHAR(191) NULL,
    `slidingScale` VARCHAR(191) NULL,
    `mediumOfTherapy` VARCHAR(191) NULL,
    `reference` VARCHAR(191) NULL,
    `intakeClinician` VARCHAR(191) NULL,
    `keyTherapist` VARCHAR(191) NULL,
    `psychiatrist` VARCHAR(191) NULL,
    `seekerId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `IntakeInformation_seekerId_key`(`seekerId`),
    INDEX `IntakeInformation_seekerId_idx`(`seekerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BasicDemographicDetails` (
    `id` VARCHAR(191) NOT NULL,
    `age` INTEGER NULL,
    `dateOfBirth` DATETIME(3) NULL,
    `sexAssignedAtBirth` ENUM('Male', 'Female', 'InterSex') NULL,
    `identifiedGender` VARCHAR(191) NULL,
    `preferredPronoun` VARCHAR(191) NULL,
    `currentAddress` VARCHAR(191) NULL,
    `permanentAddress` VARCHAR(191) NULL,
    `contactNumber` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `occupation` VARCHAR(191) NULL,
    `relationshipStatus` VARCHAR(191) NULL,
    `religion` VARCHAR(191) NULL,
    `caste` VARCHAR(191) NULL,
    `seekerId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `BasicDemographicDetails_seekerId_key`(`seekerId`),
    INDEX `BasicDemographicDetails_seekerId_idx`(`seekerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EmergencyContact` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `relationship` VARCHAR(191) NULL,
    `proximity` VARCHAR(191) NULL,
    `contact` VARCHAR(191) NULL,
    `seekerId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `EmergencyContact_seekerId_key`(`seekerId`),
    INDEX `EmergencyContact_seekerId_idx`(`seekerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PresentingProblem` (
    `id` VARCHAR(191) NOT NULL,
    `seekerId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `PresentingProblem_seekerId_key`(`seekerId`),
    INDEX `PresentingProblem_seekerId_idx`(`seekerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EpisodicDocumentation` (
    `id` VARCHAR(191) NOT NULL,
    `timestamp` DATETIME(3) NULL,
    `verbatim` VARCHAR(191) NULL,
    `onset` VARCHAR(191) NULL,
    `duration` VARCHAR(191) NULL,
    `course` VARCHAR(191) NULL,
    `yourComments` VARCHAR(191) NULL,
    `presentingProblemId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `EpisodicDocumentation_presentingProblemId_key`(`presentingProblemId`),
    INDEX `EpisodicDocumentation_presentingProblemId_idx`(`presentingProblemId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HistoryOfPresentProblem` (
    `id` VARCHAR(191) NOT NULL,
    `timestamp` DATETIME(3) NULL,
    `keySymptoms` VARCHAR(191) NULL,
    `precipitatingFactors` VARCHAR(191) NULL,
    `predisposingFactors` VARCHAR(191) NULL,
    `perpetuatingFactors` VARCHAR(191) NULL,
    `protectiveFactors` VARCHAR(191) NULL,
    `summary` VARCHAR(191) NULL,
    `presentingProblemId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `HistoryOfPresentProblem_presentingProblemId_key`(`presentingProblemId`),
    INDEX `HistoryOfPresentProblem_presentingProblemId_idx`(`presentingProblemId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PreMorbidPersonality` (
    `id` VARCHAR(191) NOT NULL,
    `opennessToExperience` VARCHAR(191) NULL,
    `conscientiousness` VARCHAR(191) NULL,
    `extraversion` VARCHAR(191) NULL,
    `agreeableness` VARCHAR(191) NULL,
    `neuroticism` VARCHAR(191) NULL,
    `introversion` VARCHAR(191) NULL,
    `noveltySeeking` VARCHAR(191) NULL,
    `impulsiveness` VARCHAR(191) NULL,
    `perfectionism` VARCHAR(191) NULL,
    `humour` VARCHAR(191) NULL,
    `assertiveness` VARCHAR(191) NULL,
    `empathy` VARCHAR(191) NULL,
    `autonomy` VARCHAR(191) NULL,
    `adaptivity` VARCHAR(191) NULL,
    `altruism` VARCHAR(191) NULL,
    `resilience` VARCHAR(191) NULL,
    `patience` VARCHAR(191) NULL,
    `curiosity` VARCHAR(191) NULL,
    `creativity` VARCHAR(191) NULL,
    `defiance` VARCHAR(191) NULL,
    `seekerId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `PreMorbidPersonality_seekerId_key`(`seekerId`),
    INDEX `PreMorbidPersonality_seekerId_idx`(`seekerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PastHistory` (
    `id` VARCHAR(191) NOT NULL,
    `yourComments` VARCHAR(191) NULL,
    `seekerId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `PastHistory_seekerId_key`(`seekerId`),
    INDEX `PastHistory_seekerId_idx`(`seekerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MedicalHistory` (
    `id` VARCHAR(191) NOT NULL,
    `chronicIllnesses` VARCHAR(191) NULL,
    `surgeries` VARCHAR(191) NULL,
    `accidents` VARCHAR(191) NULL,
    `traumas` VARCHAR(191) NULL,
    `acuteNeurologicalConditions` VARCHAR(191) NULL,
    `majorInfectiousDiseases` VARCHAR(191) NULL,
    `yourComments` VARCHAR(191) NULL,
    `pastHistoryId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `MedicalHistory_pastHistoryId_key`(`pastHistoryId`),
    INDEX `MedicalHistory_pastHistoryId_idx`(`pastHistoryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PsychiatricHistory` (
    `id` VARCHAR(191) NOT NULL,
    `yourComments` VARCHAR(191) NULL,
    `pastHistoryId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `PsychiatricHistory_pastHistoryId_key`(`pastHistoryId`),
    INDEX `PsychiatricHistory_pastHistoryId_idx`(`pastHistoryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Therapy` (
    `id` VARCHAR(191) NOT NULL,
    `taken` ENUM('yes', 'no') NULL,
    `purpose` VARCHAR(191) NULL,
    `duration` VARCHAR(191) NULL,
    `outcome` VARCHAR(191) NULL,
    `reasonForLeaving` VARCHAR(191) NULL,
    `factorsWhichHelpedInTherapy` VARCHAR(191) NULL,
    `psychiatricHistoryId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Therapy_psychiatricHistoryId_key`(`psychiatricHistoryId`),
    INDEX `Therapy_psychiatricHistoryId_idx`(`psychiatricHistoryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Psychiatry` (
    `id` VARCHAR(191) NOT NULL,
    `taken` ENUM('yes', 'no') NULL,
    `purpose` VARCHAR(191) NULL,
    `duration` VARCHAR(191) NULL,
    `outcome` VARCHAR(191) NULL,
    `reasonForLeaving` VARCHAR(191) NULL,
    `factorsWhichHelpedInTherapy` VARCHAR(191) NULL,
    `psychiatricHistoryId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Psychiatry_psychiatricHistoryId_key`(`psychiatricHistoryId`),
    INDEX `Psychiatry_psychiatricHistoryId_idx`(`psychiatricHistoryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PersonalHistory` (
    `id` VARCHAR(191) NOT NULL,
    `yourComments` VARCHAR(191) NULL,
    `seekerId` VARCHAR(191) NOT NULL,
    `perinatal` VARCHAR(191) NULL,
    `childhood` VARCHAR(191) NULL,
    `adolescent` VARCHAR(191) NULL,
    `adulthood` VARCHAR(191) NULL,
    `oldAge` VARCHAR(191) NULL,

    UNIQUE INDEX `PersonalHistory_seekerId_key`(`seekerId`),
    INDEX `PersonalHistory_seekerId_idx`(`seekerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Perinatal` (
    `id` VARCHAR(191) NOT NULL,
    `birthComplications` ENUM('Anoxia', 'Hypoxia', 'PreTermDelivery', 'DelayedCrying', 'ForcepsSuctionDelivery', 'LowBirthWeight', 'RequiredNICUCare') NULL,
    `developmentalMilestones` ENUM('Normal', 'DelayedSensoryMS', 'DelayedMotorMS', 'DelayedSpeechMS', 'DelayedSocialMS') NULL,
    `personalHistoryId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Perinatal_personalHistoryId_key`(`personalHistoryId`),
    INDEX `Perinatal_personalHistoryId_idx`(`personalHistoryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Childhood` (
    `id` VARCHAR(191) NOT NULL,
    `academicAndScholasticDevelopment` ENUM('ReadingDifficulty', 'WritingDifficulty', 'NumericalDifficulty') NULL,
    `behaviouralPatterns` ENUM('DeficitsInSocializing', 'SeparationAnxiety', 'AttentionProblems', 'Hyperactivity', 'Defiance') NULL,
    `personalHistoryId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Childhood_personalHistoryId_key`(`personalHistoryId`),
    INDEX `Childhood_personalHistoryId_idx`(`personalHistoryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Adolescent` (
    `id` VARCHAR(191) NOT NULL,
    `majorEvents` VARCHAR(191) NULL,
    `choosingCareerStream` ENUM('Clear', 'Confused', 'NeverThought') NULL,
    `identityRoleConfusion` ENUM('Present', 'Absent') NULL,
    `romanticEndeavours` ENUM('Initiated', 'Problematic', 'NotInitiated') NULL,
    `familyEnvironment` ENUM('Supportive', 'Unsupportive', 'Critical') NULL,
    `emotionalIssues` ENUM('Breakdowns', 'Loneliness', 'NoIssues') NULL,
    `personalHistoryId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Adolescent_personalHistoryId_key`(`personalHistoryId`),
    INDEX `Adolescent_personalHistoryId_idx`(`personalHistoryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Adulthood` (
    `id` VARCHAR(191) NOT NULL,
    `copingResources` VARCHAR(191) NULL,
    `personalHistoryId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Adulthood_personalHistoryId_key`(`personalHistoryId`),
    INDEX `Adulthood_personalHistoryId_idx`(`personalHistoryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `KeyLifeEvents` (
    `id` VARCHAR(191) NOT NULL,
    `education` ENUM('InProgress', 'Complete') NULL,
    `job` ENUM('Satisfied', 'Unsatisfied') NULL,
    `marriage` ENUM('NotInterested', 'Satisfied', 'Unsatisfied', 'DifficultiesFindingPartner') NULL,
    `childbirth` ENUM('ChoosesNotToHave', 'DifficultyInConceiving', 'PostPartum', 'Satisfied') NULL,
    `financialStability` ENUM('NotSettled', 'InProcess', 'WellSettled') NULL,
    `familyResponsibilities` ENUM('IllnessCaregiving', 'FinancialLiabilities', 'Household') NULL,
    `adulthoodId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `KeyLifeEvents_adulthoodId_key`(`adulthoodId`),
    INDEX `KeyLifeEvents_adulthoodId_idx`(`adulthoodId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OldAge` (
    `id` VARCHAR(191) NOT NULL,
    `transitionToOldAge` VARCHAR(191) NULL,
    `adjustmentAndStresses` VARCHAR(191) NULL,
    `emotionalCoping` VARCHAR(191) NULL,
    `personalHistoryId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `OldAge_personalHistoryId_key`(`personalHistoryId`),
    INDEX `OldAge_personalHistoryId_idx`(`personalHistoryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SexualHistory` (
    `id` VARCHAR(191) NOT NULL,
    `onsetOfPuberty` DATETIME(3) NULL,
    `sexualIdentity` VARCHAR(191) NULL,
    `genderIdentity` VARCHAR(191) NULL,
    `firstSelfExplorationExperience` VARCHAR(191) NULL,
    `firstSexualExperience` VARCHAR(191) NULL,
    `arousalAndOrgasmicFantasy` VARCHAR(191) NULL,
    `sexualDiseases` VARCHAR(191) NULL,
    `currentSexualFunctioning` VARCHAR(191) NULL,
    `sexualAbuse` VARCHAR(191) NULL,
    `seekerId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `SexualHistory_seekerId_key`(`seekerId`),
    INDEX `SexualHistory_seekerId_idx`(`seekerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Substances` (
    `id` VARCHAR(191) NOT NULL,
    `introductionToSubstances` DATETIME(3) NULL,
    `substancesUsed` VARCHAR(191) NULL,
    `frequency` VARCHAR(191) NULL,
    `quantity` VARCHAR(191) NULL,
    `reason` VARCHAR(191) NULL,
    `seekerId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Substances_seekerId_key`(`seekerId`),
    INDEX `Substances_seekerId_idx`(`seekerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FamilyHistory` (
    `id` VARCHAR(191) NOT NULL,
    `familyStructure` VARCHAR(191) NULL,
    `genogram` VARCHAR(191) NULL,
    `sourcesOfStress` VARCHAR(191) NULL,
    `sourcesOfSupport` VARCHAR(191) NULL,
    `mentalHealthHistoryInFamily` VARCHAR(191) NULL,
    `seekerId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `FamilyHistory_seekerId_key`(`seekerId`),
    INDEX `FamilyHistory_seekerId_idx`(`seekerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PeersAndSocialHistory` (
    `id` VARCHAR(191) NOT NULL,
    `friendships` VARCHAR(191) NULL,
    `relationshipWithPeers` VARCHAR(191) NULL,
    `relationshipWithColleagues` VARCHAR(191) NULL,
    `seekerId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `PeersAndSocialHistory_seekerId_key`(`seekerId`),
    INDEX `PeersAndSocialHistory_seekerId_idx`(`seekerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WorkAndCareer` (
    `id` VARCHAR(191) NOT NULL,
    `natureOfWork` VARCHAR(191) NULL,
    `changesInSchool` VARCHAR(191) NULL,
    `changesInCollege` VARCHAR(191) NULL,
    `changesInJob` VARCHAR(191) NULL,
    `reasonsForChange` VARCHAR(191) NULL,
    `sourcesOfStress` VARCHAR(191) NULL,
    `sourcesOfSupport` VARCHAR(191) NULL,
    `seekerId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `WorkAndCareer_seekerId_key`(`seekerId`),
    INDEX `WorkAndCareer_seekerId_idx`(`seekerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProvisionalDiagnosis` (
    `id` VARCHAR(191) NOT NULL,
    `provisionalDiagnosis` VARCHAR(191) NULL,
    `seekerId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ProvisionalDiagnosis_seekerId_key`(`seekerId`),
    INDEX `ProvisionalDiagnosis_seekerId_idx`(`seekerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DifferentialDiagnosis` (
    `id` VARCHAR(191) NOT NULL,
    `differentialDiagnosis` VARCHAR(191) NULL,
    `seekerId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `DifferentialDiagnosis_seekerId_key`(`seekerId`),
    INDEX `DifferentialDiagnosis_seekerId_idx`(`seekerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MentalStatusExamination` (
    `id` VARCHAR(191) NOT NULL,
    `timestamp` DATETIME(3) NULL,
    `attentionAndConcentration` VARCHAR(191) NULL,
    `moodAndAffect` VARCHAR(191) NULL,
    `levelOfInsight` VARCHAR(191) NULL,
    `yourComments` VARCHAR(191) NULL,
    `generalAppearance` VARCHAR(191) NULL,
    `thoughts` VARCHAR(191) NULL,
    `cognition` VARCHAR(191) NULL,
    `seekerId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `MentalStatusExamination_seekerId_key`(`seekerId`),
    INDEX `MentalStatusExamination_seekerId_idx`(`seekerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GeneralAppearance` (
    `id` VARCHAR(191) NOT NULL,
    `grooming` VARCHAR(191) NULL,
    `speech` VARCHAR(191) NULL,
    `bodyMovements` VARCHAR(191) NULL,
    `postures` VARCHAR(191) NULL,
    `eyeContact` VARCHAR(191) NULL,
    `mentalStatusExaminationId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `GeneralAppearance_mentalStatusExaminationId_key`(`mentalStatusExaminationId`),
    INDEX `GeneralAppearance_mentalStatusExaminationId_idx`(`mentalStatusExaminationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Thoughts` (
    `id` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NULL,
    `process` VARCHAR(191) NULL,
    `mentalStatusExaminationId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Thoughts_mentalStatusExaminationId_key`(`mentalStatusExaminationId`),
    INDEX `Thoughts_mentalStatusExaminationId_idx`(`mentalStatusExaminationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cognition` (
    `id` VARCHAR(191) NOT NULL,
    `judgement` VARCHAR(191) NULL,
    `mentalStatusExaminationId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Cognition_mentalStatusExaminationId_key`(`mentalStatusExaminationId`),
    INDEX `Cognition_mentalStatusExaminationId_idx`(`mentalStatusExaminationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Orientation` (
    `id` VARCHAR(191) NOT NULL,
    `time` DATETIME(3) NULL,
    `place` VARCHAR(191) NULL,
    `person` VARCHAR(191) NULL,
    `cognitionId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Orientation_cognitionId_key`(`cognitionId`),
    INDEX `Orientation_cognitionId_idx`(`cognitionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Memory` (
    `id` VARCHAR(191) NOT NULL,
    `working` VARCHAR(191) NULL,
    `shortTerm` VARCHAR(191) NULL,
    `longTerm` VARCHAR(191) NULL,
    `cognitionId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Memory_cognitionId_key`(`cognitionId`),
    INDEX `Memory_cognitionId_idx`(`cognitionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
