package <%= packageSignature %>.config.swagger

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.boot.context.properties.ConstructorBinding

@ConstructorBinding
@ConfigurationProperties(prefix = "swagger.service")
class SwaggerProperties(
        val version: String,
        val title: String,
        val description: String,
        val termsPath: String,
        val email: String,
        val licenceType: String,
        val licencePath: String
)
