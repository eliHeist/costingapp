import re
from django import template

register = template.Library()

@register.filter
def add_commas(value):
    try:
        return '{:,.0f}'.format(float(value))
    except (ValueError, TypeError):
        return value

@register.filter(name='split_newline')
def split_newline(value):
    cleaned_text = re.sub(r'\n\s*\n', '\n', value)
    return cleaned_text.split('\n')

@register.filter(name='removeLast')
def removeLast(value):
    return value[:-1]

@register.filter(name='len')
def len(value=None):
    return len(value) if value else None

@register.filter(name='phone_number')
def phone_number(phone_number):
    # Remove any non-digit characters from the phone number
    cleaned_number = ''.join(c for c in phone_number if c.isdigit())

    # Check if the number starts with '+256'
    if cleaned_number.startswith('256'):
        # Format as +256 xxx xxx xxx
        formatted_number = f"+256 {cleaned_number[3:6]} {cleaned_number[6:9]} {cleaned_number[9:]}"
    elif cleaned_number.startswith('0'):
        # Format as 0xx xxx xxx xxx
        formatted_number = f"0{cleaned_number[1:4]} {cleaned_number[4:7]} {cleaned_number[7:10]} {cleaned_number[10:]}"
    else:
        # If it doesn't match either format, return the original number
        formatted_number = phone_number
    return formatted_number

@register.filter(name='first_item')
def first_item(value):
    return value[0]

@register.filter(name='add')
def add(value, arg):
    return value + arg

@register.filter(name='safe_html')
def safe_html(value:str):
    text = ''
    if value:
        text = value.replace('\n', '<br>')
    return text
