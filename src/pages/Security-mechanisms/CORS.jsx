import SecurityMechanismTemplate from "../../components/SecurityMechanismTemplate/SecurityMechanismTemplate";
import { corsData } from "../../data/securityMechanisms";

function Cors() {
  return (
    <SecurityMechanismTemplate
      securityMechanismTitle={corsData.securityMechanismTitle}
      definition={corsData.definition}
      interestingFacts={corsData.interestingFacts}
      implementationDescription={corsData.implementationDescription}
      implementationCode={corsData.implementationCode}
      goodPractices={corsData.goodPractices}
      threats={corsData.threats}
    />
  );
}

export default Cors;
