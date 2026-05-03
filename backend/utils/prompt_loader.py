from pathlib import Path


def load_system_prompt() -> str:
    """Load the Granite system prompt from docs/granite_system_prompt.md"""
    prompt_path = Path(__file__).parent.parent.parent / "docs" / "granite_system_prompt.md"
    
    if not prompt_path.exists():
        raise FileNotFoundError(f"System prompt not found at {prompt_path}")
    
    with open(prompt_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    lines = content.split("\n")
    prompt_lines = []
    in_prompt_section = False
    
    for line in lines:
        if line.strip() == "---" and not in_prompt_section:
            in_prompt_section = True
            continue
        if in_prompt_section:
            prompt_lines.append(line)
    
    prompt = "\n".join(prompt_lines).strip()
    
    if not prompt:
        raise ValueError("System prompt is empty after parsing")
    
    return prompt

# Made with Bob
