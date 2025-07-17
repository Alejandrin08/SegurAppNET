import SecurityMechanismTemplate from "../../components/SecurityMechanismTemplate/SecurityMechanismTemplate";
import { htmlEncoderData } from "../../data/htmlEncoderData";

function HtmlEncoder() {
  return (
    <SecurityMechanismTemplate
      securityMechanismTitle={htmlEncoderData.securityMechanismTitle}
      definition={htmlEncoderData.definition}
      interestingFacts={htmlEncoderData.interestingFacts}
      implementationDescription={htmlEncoderData.implementationDescription}
      implementationCode={htmlEncoderData.implementationCode}
      goodPractices={htmlEncoderData.goodPractices}
      threats={htmlEncoderData.threats}
    />
  );
}

export default HtmlEncoder;
