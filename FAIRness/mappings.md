Here is the complete mapping schema established in your updated translation layer. It shows exactly how the deeply nested **re3data Schema v4.0** structures are cleaned, flattened, and translated into the legacy keys that your `infer_fair_value()` engine expects.

---

### The FAIR-to-re3data Mapping Blueprint

| FAIR Metric / Field | re3data v4.0 XML Tag Structure | Normalized Key passed to `infer_fair_value` |
| --- | --- | --- |
| **`Findability: metadataPersistence`**<br>

<br>**`Reusability: provenanceInfo`** | `<r3d:versioning>` | `repositoryVersioning`<br>

<br>`provenanceInfo`<br>

<br>`metadataPersistence` |
| **`Accessibility: retrievalProtocol`** | `<r3d:api>`<br>

<br>└─ `<r3d:apiType>` | `retrievalProtocol`<br>

<br>`apiType`<br>

<br>`apiUrl` |
| **`Findability: metadataSchema`**<br>

<br>**`Findability: richMetadata`** | `<r3d:metadataStandard>`<br>

<br>└─ `<r3d:metadataStandardName>` | `metadataStandardName`<br>

<br>`metadataStandardNames` *(List)* |
| **`Accessibility: authenticationRequired`** | `<r3d:databaseAccessType>` / `<r3d:dataAccessType>` / `<r3d:dataUploadType>` | `authenticationRequired`<br>

<br>*(Evaluates to `'yes'` if any tag is restricted, closed, embargoed, or registration)* |
| **`Accessibility: authenticationType`** | `<r3d:databaseAccessType>` / `<r3d:dataAccessType>` / `<r3d:dataUploadType>` | `authenticationType`<br>

<br>*(Evaluates to `'credentials'` if authentication is required; else `'none'`)* |
| **`Accessibility: metadataAlwaysAvailable`** | *N/A (Registry baseline)* | `metadataAlwaysAvailable`<br>

<br>*(Automatically set to `'yes'` for active indexed endpoints)* |
| **`Reusability: citationGuidelines`** | `<r3d:citationGuidelineUrl>` | Both `citationGuidelineUrl` and `citationGuidelineURL` are exposed to prevent casing bugs. |

---

### Inside the Translation Engine: Key Highlights

* **The Access Key Unpacker:** When the XML parser encounters tags like `<r3d:dataAccess>`, it strips out the nested blocks and passes a clean, flat string value (e.g., `"open"`, `"restricted"`) back to the evaluation dictionary.
* **The Casing Mirror:** Your `infer_fair_value` function sometimes relies on exact case strings. To completely eliminate failures due to camelCase vs. UPPERCASE, any key generated that contains `Url` is automatically duplicated as `URL` (and vice-versa) before the evaluation engine touches it.