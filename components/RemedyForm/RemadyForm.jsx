import { useState } from "react";
import useSWR from "swr";
import { useRouter } from "next/router";
import styled, { css } from "styled-components";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
const Label = styled.label`
  display: flex;
  flex-direction: column;
  font-weight: bold;
`;
const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  ${(props) =>
    props.error &&
    css`
      border-color: red;
    `}
`;
const Textarea = styled.textarea`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  ${(props) =>
    props.error &&
    css`
      border-color: red;
    `}
`;
const Button = styled.button`
  padding: 0.75rem;
  background-color: #1fab89;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:disabled {
    background-color: #999;
    cursor: not-allowed;
  }
`;

const RemoveBtn = styled.button`
  margin-left: 0.5rem;
  background: none;
  border: none;
  color: red;
  cursor: pointer;
  font-weight: bold;
`;
const ChipContainer = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  text-decoration: none;
`;
const Chip = styled.li`
  display: flex;
  align-items: center;
  background: #f0f0f0;
  padding: 0.4rem 0.6rem;
  border-radius: 16px;
  margin: 0.2rem;
  font-size: 0.9rem;
`;
const ErrorText = styled.p`
  color: red;
  font-size: 0.875rem;
`;

export default function RemedyForm({ mode = "create" }) {
  const router = useRouter();
  const { data: symptomsList = [], error, isLoading } = useSWR("/api/symptoms");
  const [ingredients, setIngredients] = useState([""]);
  const [symptoms, setSymptoms] = useState([]);
  const [selectedSymptom, setSelectedSymptom] = useState("");
  const [errors, setErrors] = useState({});

  const validate = (title, ingredientsList, symptomsList) => {
    const errs = {};
    if (!title.trim()) errs.title = "Title is required.";
    if (ingredientsList.filter((i) => i.trim()).length < 1)
      errs.ingredients = "At least one ingredient is required.";
    if (symptomsList.length < 1) errs.symptoms = "Select at least one symptom.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const title = formData.get("title") || "";
    const preparation = formData.get("preparation") || "";
    const usage = formData.get("usage") || "";

    const validationErrors = validate(title, ingredients, symptoms);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    const payload = {
      title,
      ingredients: ingredients.filter((i) => i.trim()),
      preparation,
      usage,
      symptoms,
    };

    const res = await fetch("/api/remedies/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push("/");
    }
  };

  const handleAddSymptom = () => {
    if (selectedSymptom && !symptoms.includes(selectedSymptom)) {
      setSymptoms([...symptoms, selectedSymptom]);
      setSelectedSymptom("");
      setErrors((prev) => ({ ...prev, symptoms: undefined }));
    }
  };

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
    if (newIngredients.some((i) => i.trim())) {
      setErrors((prev) => ({ ...prev, ingredients: undefined }));
    }
  };

  const canAddIngredient = ingredients[ingredients.length - 1].trim() !== "";

  if (isLoading) return <p>Loading symptoms...</p>;
  if (error) return <p>Failed to load symptoms.</p>;

  return (
    <Form onSubmit={handleSubmit}>
      <Label>
        Title *
        <Input name="title" error={!!errors.title} required />
        {errors.title && <ErrorText>{errors.title}</ErrorText>}
      </Label>

      <Label>
        Ingredients *
        <ChipContainer>
          {ingredients.map((value, index) => (
            <Chip key={index}>
              <Input
                style={{
                  border: "none",
                  background: "transparent",
                  width: "auto",
                }}
                value={value}
                error={!!errors.ingredients && index === 0}
                onChange={(e) => handleIngredientChange(index, e.target.value)}
                required={index === 0}
              />
              <RemoveBtn
                type="button"
                onClick={() =>
                  setIngredients((prev) =>
                    prev.length > 1 ? prev.filter((_, i) => i !== index) : prev
                  )
                }
              >
                ✕
              </RemoveBtn>
            </Chip>
          ))}
        </ChipContainer>
        <Button
          type="button"
          onClick={() => setIngredients([...ingredients, ""])}
          disabled={!canAddIngredient}
        >
          +
        </Button>
        {errors.ingredients && <ErrorText>{errors.ingredients}</ErrorText>}
      </Label>

      <Label>
        Preparation
        <Textarea name="preparation" rows={4} />
      </Label>

      <Label>
        Usage
        <Textarea name="usage" rows={4} />
      </Label>

      <Label>
        Symptoms *
        <select
          value={selectedSymptom}
          onChange={(e) => setSelectedSymptom(e.target.value)}
        >
          <option value="">Select symptom</option>
          {symptomsList
            .filter((s) => !symptoms.includes(s._id))
            .map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
        </select>
        <Button
          type="button"
          onClick={handleAddSymptom}
          disabled={!selectedSymptom}
        >
          +
        </Button>
        <ChipContainer>
          {symptoms.map((symId, i) => {
            const sym = symptomsList.find((s) => s._id === symId);
            return (
              <Chip key={symId}>
                {sym?.name || symId}
                <RemoveBtn
                  type="button"
                  onClick={() =>
                    setSymptoms((prev) =>
                      prev.filter((_, index) => index !== i)
                    )
                  }
                >
                  ✕
                </RemoveBtn>
              </Chip>
            );
          })}
        </ChipContainer>
        {errors.symptoms && <ErrorText>{errors.symptoms}</ErrorText>}
      </Label>

      <Button type="submit">
        {mode === "create" ? "Create Remedy" : "Save Changes"}
      </Button>
    </Form>
  );
}
