 import React, { useState} from "react";
 import styled from 'styled-components';
 import "../../App.css";

 const MedicationLog = () => {
    const [selectedFrequency, setSelectedFrequency] = useState("");
    const [otherFrequency, setOtherFrequency] = useState("");
    
    return (
        <Container className="formComp">
            <Title>Residential Operation (GRO)</Title>
            <Subtitle>Medication Log</Subtitle>
            <DescriptionBox>
                <Description>
                    Standard 748.2151 - One Log per medication or supplement is required.
                    <br/>
                    <br/>
                    ** A cumulative record of all prescriptions administered, non-prescription
                    medications, or supplements for children under 5 must be kept together in 
                    the child's record and updated within 2 hours of mediciation administration.
                </Description>
            </DescriptionBox>

            <FormSection>
                <FormRow>
                    <Label>Child Name:</Label>
                    <Input type="text" />
                </FormRow>

                <FormRow>
                    <Label>Unit:</Label>
                    <Input type="text"/>
                </FormRow>

                <FormRow>
                    <Label>Date (Month &amp; Year):</Label>
                    <Input type="month"/>
                </FormRow>

                <FormRow>
                    <Label>Drug or supplement Allergies or Contraindications:</Label>
                    <Input type="text"/>
                </FormRow>

                <FormRow>
                    <Label>Child's Refusal (List * in the time box as applicable):</Label>
                    <Input type=""/>
                </FormRow>

                <FormRow>
                    <Label>Prescriber Name (if applicable):</Label>
                    <Input type="text"/>
                </FormRow>

                <FormRow>
                    <Label>Prescriber Are Code and Phone No.:</Label>
                    <Input type="text"/>
                </FormRow>

                <FormRow>
                    <Label>Pharmacy (if applicable):</Label>
                    <Input type="text" />
                </FormRow>

                <FormRow>
                    <Label>Pharmacy Area Code and Phone No.:</Label>
                    <Input type="text" placeholder="e.g. (123) 456-7890" />
                </FormRow>

                <FormRow>
                    <Label>Name of Medication or Supplement:</Label>
                    <Input type="text" />
                </FormRow>

                <FormRow>
                    <Label>Strength:</Label>
                    <Input type="text" />
                </FormRow>

                <FormRow>
                    <Label>Dosage:</Label>
                    <Input type="text" />
                </FormRow>

                <FormRow>
                <Label>Frequency:</Label>
                <RadioGroup>
                    {["Daily", "Twice Daily", "Three Times Daily", "PRN (as Needed)"].map(
                    (option) => (
                        <RadioLabel key={option}>
                        <RadioInput
                            type="radio"
                            name="frequency"
                            value={option}
                            checked={selectedFrequency === option}
                            onChange={(e) => setSelectedFrequency(e.target.value)}
                        />
                        {option}
                        </RadioLabel>
                    )
                    )}

                    <RadioLabel>
                    <RadioInput
                        type="radio"
                        name="frequency"
                        value="Other"
                        checked={selectedFrequency === "Other"}
                        onChange={(e) => setSelectedFrequency(e.target.value)}
                    />
                    Other:
                    {selectedFrequency === "Other" && (
                        <OtherInput
                        type="text"
                        placeholder="Specify..."
                        value={otherFrequency}
                        onChange={(e) => setOtherFrequency(e.target.value)}
                        />
                    )}
                    </RadioLabel>
                </RadioGroup>
                </FormRow>

                <FormRow>
                    <Label>Reason for Prescribed Medication:</Label>
                    <TextArea rows="3" placeholder="Enter reason here..." />
                    </FormRow>

                    <FormRow>
                    <Label>
                        Reason(s) for PRN and Nonprescription Medication including specific
                        symptoms, conditions or injury of the child:
                    </Label>
                    <TextArea rows="4" placeholder="Enter details here..." />
                </FormRow>
            </FormSection>
        </Container>
    );
 };

 export default MedicationLog;

 const Container = styled.div`
    max-width: 900px;
    // margin: 40px auto;
    padding: 30px;
    font-family: "Arial", sans-serif;
 `;

 const Title = styled.h1`
    font-size: 1.8rem;
    text-align: center;
    margin-bottom: 10px;
 `;

 const Subtitle = styled.h2`
    font-size: 1.5rem;
    text-align: center;
    margin-bottom: 20px;
    color: #444;
 `;

 const DescriptionBox = styled.div`
    border: 2px solid #ccc;
    border-radius:6px;
    padding:20px;
    margin-bottom: 40px;
    background-color: #f9f9f9;
 `;

 const Description = styled.p`
    font-size: 1rem;
    line-height:1.5;
    color:#333;
    text-align:center;
 `;

 const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const FormRow = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: bold;
  margin-bottom: 5px;
`;

const Input = styled.input`
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const RadioGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 8px;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: normal;
`;

const RadioInput = styled.input`
  accent-color: #007bff;
`;

const OtherInput = styled.input`
  margin-left: 8px;
  padding: 6px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
`;

const TextArea = styled.textarea`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  resize: vertical;
  min-height: 70px;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;