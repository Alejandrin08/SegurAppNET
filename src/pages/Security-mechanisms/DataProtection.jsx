import SecurityMechanismTemplate from "../../components/SecurityMechanismTemplate/SecurityMechanismTemplate";
import { dataProtectionData } from "../../data/securityMechanisms";

function DataProtection() {
  return (
    <SecurityMechanismTemplate
      securityMechanismTitle={dataProtectionData.securityMechanismTitle}
      definition={dataProtectionData.definition}
      interestingFacts={dataProtectionData.interestingFacts}
      implementationDescription={dataProtectionData.implementationDescription}
      implementationCode={dataProtectionData.implementationCode}
      goodPractices={dataProtectionData.goodPractices}
      threats={dataProtectionData.threats}
    />
  );
}

export default DataProtection;
