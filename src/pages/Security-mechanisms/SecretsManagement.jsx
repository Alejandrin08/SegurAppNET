import SecurityMechanismTemplate from "../../components/SecurityMechanismTemplate/SecurityMechanismTemplate";
import { secretsManagementData } from "../../data/secretsManagementData";

function SecretsManagement() {
  return (
    <SecurityMechanismTemplate
      securityMechanismTitle={secretsManagementData.securityMechanismTitle}
      definition={secretsManagementData.definition}
      interestingFacts={secretsManagementData.interestingFacts}
      implementationDescription={
        secretsManagementData.implementationDescription
      }
      implementationCode={secretsManagementData.implementationCode}
      goodPractices={secretsManagementData.goodPractices}
      threats={secretsManagementData.threats}
    />
  );
}

export default SecretsManagement;
