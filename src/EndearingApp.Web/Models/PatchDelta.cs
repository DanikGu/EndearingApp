public class PatchDelta<T> : Dictionary<string, object>
{
    public void Patch(T etn)
    {
        if (etn is null)
        {
            return;
        }
        foreach (var prop in this)
        {
            SetFieldByName(etn, prop.Key, prop.Value);
        }
    }

    private void SetFieldByName(object obj, string name, object value)
    {
        var prop = obj.GetType()
            .GetProperties()
            .FirstOrDefault(x => string.Equals(x.Name, name, StringComparison.OrdinalIgnoreCase));
        if (prop is null)
        {
            return;
        }
        if (value is null && prop.PropertyType.IsValueType)
        {
            return;
        }
        var propType =
            prop.PropertyType.IsGenericType
            && prop.PropertyType.GetGenericTypeDefinition() == typeof(Nullable<>)
                ? Nullable.GetUnderlyingType(prop.PropertyType)
                : prop.PropertyType;
        if (value is not null && propType != value.GetType())
        {
            if (propType == typeof(Guid) && value.GetType() == typeof(string))
            {
                value = new Guid((string)value);
            }
            else if (propType!.IsEnum)
            {
                value = Enum.ToObject(propType, value);
            }
            else
            {
                value = Convert.ChangeType(value, propType);
            }
        }
        prop.SetValue(obj, value);
    }
}
