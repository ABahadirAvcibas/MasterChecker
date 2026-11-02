from llm_service import analyze_with_llm


user_profile = """
I graduated from Statistics with a GPA of 3.45/4.00.

My IELTS Academic score is 7.0.

I want to study Computer Science with a focus on AI.

I have not taken the GRE.

My maximum tuition budget is 12,000 EUR per year.
"""


university_page = """
Master of Science in Computer Science

Admission Requirements:

1. Applicants must have a minimum GPA of 3.0/4.0.

2. An IELTS Academic score of at least 6.5 is required.

3. Applicants must submit a GRE score of at least 310.

4. Applicants must hold a Bachelor's degree in Computer
Science or a closely related field.

The program is taught entirely in English.
"""


result = analyze_with_llm(
    user_prompt=user_profile,
    page_text=university_page
)


print("\n========== GRADCHECK ANALYSIS ==========\n")

print(result["analysis"])


print("\n========== MODEL ==========\n")

print(result["model"])


print("\n========== TOKEN USAGE ==========\n")

print(result["usage"])