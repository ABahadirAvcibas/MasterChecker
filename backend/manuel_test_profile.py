from llm_service import extract_student_profile


user_profile = """
I graduated from Statistics with a GPA of 3.45/4.00.
My IELTS Academic score is 7.0.
I want to study Computer Science with a focus on AI.
I have not taken the GRE.
My maximum tuition budget is 12,000 EUR per year.
I prefer studying entirely in English.
"""


profile = extract_student_profile(
    user_prompt=user_profile
)


print("\n========== EXTRACTED PROFILE ==========\n")

print(profile.model_dump_json(indent=2))