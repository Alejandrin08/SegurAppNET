import SecurityMechanismTemplate from "../../components/SecurityMechanismTemplate/SecurityMechanismTemplate";
import { httpsData } from "../../data/securityMechanisms";

function Https() {
  return (
    <SecurityMechanismTemplate
      securityMechanismTitle={httpsData.securityMechanismTitle}
      definition={httpsData.definition}
      interestingFacts={httpsData.interestingFacts}
      implementationDescription={httpsData.implementationDescription}
      implementationCode={httpsData.implementationCode}
      goodPractices={httpsData.goodPractices}
      threats={httpsData.threats}
    />
  );
}

export default Https;
