import { useState } from "react";
import useSWR from "swr";
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
  gap: 0.5rem;
`;
const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #ccc;
  border-radius: 0.75rem;
  font-size: 1rem;
  outline: none;
  transition: border 0.2s;

  &:focus {
    border-color: var(--primary, #38b2ac);
    box-shadow: 0 0 0 2px rgba(56, 178, 172, 0.2);
  ${(props) =>
    props.error &&
    css`
      border-color: red;
    `}
  height: 40px;
`;
const Textarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 0.75rem 1rem;
  border: 1px solid #ccc;
  border-radius: 0.75rem;
  font-size: 1rem;
  resize: vertical;
  outline: none;

  &:focus {
    border-color: var(--primary, #38b2ac);
    box-shadow: 0 0 0 2px rgba(56, 178, 172, 0.2);
  }
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

const Select = styled.select`
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  border: 1px solid white;
  background-color: white;
  font-size: 1rem;
  font-family: Manrope;
  background-color: var(--background);
  color: var(--text-dark);
  min-width: 250px;
  outline: none;
  transition: all 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%231fab89'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 2rem;

  &:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(31, 171, 137, 0.2);
  }

  &:hover {
    border-color: var(--text-dark);
  }
`;
const ErrorText = styled.p`
  color: red;
  font-size: 0.875rem;
`;

export default function RemedyForm({ mode = "create", onSubmit, initialData }) {
  const { data: symptomsList = [], error, isLoading } = useSWR("/api/symptoms");
  const [ingredients, setIngredients] = useState(
    initialData?.ingredients || [""]
  );
  const [symptoms, setSymptoms] = useState(
    initialData?.symptoms?.map((s) => s._id) || []
  );
  const [selectedSymptom, setSelectedSymptom] = useState("");
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imageError, setImageError] = useState("");

  const MAX_UPLOAD_SIZE_MB =
    parseInt(process.env.NEXT_PUBLIC_MAX_UPLOAD_SIZE_MB, 10) || 2;

  const validate = (title, ingredientsList, symptomsList) => {
    const errs = {};
    if (!title.trim()) errs.title = "Title is required.";
    if (ingredientsList.filter((i) => i.trim()).length < 1)
      errs.ingredients = "At least one ingredient is required.";
    if (symptomsList.length < 1) errs.symptoms = "Select at least one symptom.";
    if (mode === "create" && !imageFile) errs.image = "An image is required.";
    return errs;
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageError("");
    if (file) {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        setImageError("Please select a JPG, PNG or WEBP image.");
        e.target.value = "";
        setImageFile(null);
        return;
      }
      if (file.size > MAX_UPLOAD_SIZE_MB * 1024 * 1024) {
        setImageError(`File too large. Max size is ${MAX_UPLOAD_SIZE_MB} MB.`);
        e.target.value = "";
        setImageFile(null);
        return;
      }
      setImageFile(file);
      setErrors((prev) => ({ ...prev, image: undefined }));
    }
  };

  const handleSubmit = (e) => {
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

    onSubmit({
      title,
      ingredients: ingredients.filter((i) => i.trim()),
      preparation,
      usage,
      symptoms,
      imageFile,
    });
  };

  const canAddIngredient = ingredients[ingredients.length - 1].trim() !== "";

  if (isLoading) return <p>Loading symptoms...</p>;
  if (error) return <p>Failed to load symptoms.</p>;

  return (
    <Form onSubmit={handleSubmit}>
      <Label>
        Title *
        <Input
          name="title"
          error={!!errors.title}
          required
          defaultValue={initialData?.title}
        />
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
        <Textarea
          name="preparation"
          rows={4}
          defaultValue={initialData?.preparation}
        />
      </Label>

      <Label>
        Usage
        <Textarea name="usage" rows={4} defaultValue={initialData?.usage} />
      </Label>

      <Label>
        Symptoms *
        <Select
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
        </Select>
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

      <Label>
        Upload Image {mode === "create" && "*"}
        <Input
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          onChange={handleImageChange}
          error={!!(errors.image || imageError)}
        />
        {(imageError || errors.image) && (
          <ErrorText>{imageError || errors.image}</ErrorText>
        )}
        {mode === "edit" && initialData?.imageUrl && (
          <p>Current image will be kept if no new image is uploaded</p>
        )}
      </Label>

      <Button type="submit" disabled={mode === "create" && !imageFile}>
        {mode === "create" ? "Create Remedy" : "Update Remedy"}
      </Button>
    </Form>
  );
}
