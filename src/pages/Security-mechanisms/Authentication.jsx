import SecurityMechanismTemplate from "../../components/SecurityMechanismTemplate/SecurityMechanismTemplate";
import { authenticationData } from "../../data/securityMechanisms";

function Authentication() {
  return (
    <SecurityMechanismTemplate
      securityMechanismTitle={authenticationData.securityMechanismTitle}
      definition={authenticationData.definition}
      interestingFacts={authenticationData.interestingFacts}
      implementationDescription={authenticationData.implementationDescription}
      implementationCode={authenticationData.implementationCode}
      goodPractices={authenticationData.goodPractices}
      threats={authenticationData.threats}
    />
  );
}

export default Authentication;
